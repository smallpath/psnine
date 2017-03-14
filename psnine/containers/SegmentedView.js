import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableHighlight,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    Dimensions,
    InteractionManager,
    ViewPagerAndroid,
    Animated,
    PanResponder,
    ListView,
    StatusBar,
} from 'react-native';

import { changeSegmentIndex } from '../actions/app';

import { getTopicList } from '../actions/community.js';

import Community from './viewPagers/Community';
import Qa from './viewPagers/Qa';
import Game from './viewPagers/Game';
import Battle from './viewPagers/Battle';
import Gene from './viewPagers/Gene';

import { standardColor } from '../config/colorConfig';

let screen = Dimensions.get('window');

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen;

let statusBarHeight = StatusBar.currentHeight;
let segmentedHeight = 38;
let toolbarHeight = 56;

let thisScreenHeightWitoutStatusBar = SCREEN_HEIGHT - statusBarHeight - segmentedHeight + toolbarHeight;
let viewPagerHeight = SCREEN_HEIGHT - statusBarHeight - segmentedHeight


let styles = StyleSheet.create({
    container: {

    },
    titleContainer: {
        flexDirection: 'row',
        backgroundColor: '#f00',
        height: segmentedHeight
    },
    title: {
        flex: 1,
        backgroundColor: standardColor,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 16
    },
    spacer: {
        flex: 1,
    },
    barContainer: {
        height: 6,
        position: 'relative',
        backgroundColor: standardColor,
    },
    bar: {
        backgroundColor: '#00f',
        position: 'absolute',
        height: 4,
    }
});

let isScrollByClickSegmentedButton = false;
let direction = '';

class SegmentedView extends Component {

    static propTypes = {
        duration: PropTypes.number,
        onTransitionStart: PropTypes.func,
        onTransitionEnd: PropTypes.func,
        renderTitle: PropTypes.func,
        titles: PropTypes.array,
        index: PropTypes.number,
        barColor: PropTypes.string,
        barPosition: PropTypes.string,
        underlayColor: PropTypes.string,
        stretch: PropTypes.bool,
        selectedTitleStyle: PropTypes.object,
        titleStyle: PropTypes.object,
        titleWidth: PropTypes.number,
        restWidth: PropTypes.number,
    };

    static defaultProps = {
        duration: 200,
        onTransitionStart: () => { },
        onTransitionEnd: () => { },
        renderTitle: null,
        index: 0,
        barColor: '#44B7E1',
        barPosition: 'top',
        underlayColor: '#CCCCCC',
        stretch: false,
        selectedTextStyle: null,
        textStyle: null,
        titleWidth: 72,
        restWidth: 5,
    };

    constructor(props) {
        super(props);

        let { titleWidth, restWidth } = this.props;
        this.state = {
            fadeAnim: new Animated.Value(titleWidth * 0 + restWidth),
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.communityType != nextProps.communityType) {
            this.props.communityType = nextProps.communityType;
        } else if (this.props.geneType != nextProps.geneType) {
            this.props.geneType = nextProps.geneType;
        }
    }

    componentWillMount() {
        let { titleWidth: width, restWidth } = this.props;
        let len = this.props.titles.length;
        this.panResponder = PanResponder.create({
            onPanResponderTerminationRequest: () => false,
            onStartShouldSetPanResponderCapture: () => true,
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderGrant: (e, gestureState) => {
                this.state.fadeAnim.setOffset(gestureState.x0 - width / 2);
                this.state.fadeAnim.setValue(this.state.fadeAnim._startingValue);
            },
            onPanResponderMove: Animated.event([null, {
                dx: this.state.fadeAnim,
            }]),
            onPanResponderRelease: (e, gesture) => {
                let { titleWidth: width, restWidth } = this.props;
                let targetX = e.nativeEvent.pageX;
                let segmentedIndex = parseInt(targetX / width);

                let finalTargetX = segmentedIndex * width + restWidth;

                this.state.fadeAnim.setOffset(targetX - width / 2 - restWidth);
                this.state.fadeAnim.setValue(this.state.fadeAnim._startingValue);
                this.state.fadeAnim.flattenOffset();

                // Disabled: why this.viewPager.setPage can trigger Animated.spring?
                Animated.spring(
                    this.state.fadeAnim,
                    { toValue: finalTargetX, duration: this.props.duration }
                ).start();

                isScrollByClickSegmentedButton = true;

                this.viewPage.setPage(segmentedIndex);
            }
        });

        const { dispatch } = this.props;
        const ref = this
        let currentScrolling = false;
        const setMarginTop = this.props.setMarginTop
        this.moveUpPanResponder = PanResponder.create({

            onStartShouldSetPanResponderCapture: (e, gesture) => {
                return false;
            },

            onMoveShouldSetPanResponderCapture: (e, gesture) => {
                let shouldSet = Math.abs(gesture.dy) >= 4;
                return shouldSet;
            },

            onPanResponderGrant: (e, gesture) => {

            },
            onPanResponderMove: (e, gesture) => {
                let dy = gesture.dy;
                let vy = gesture.vy;
                if (dy < 0) {
                    dy = dy + setMarginTop(null, null, true);
                    if (-dy <= toolbarHeight && dy <= 0) {
                        setMarginTop(dy)
                    } else {
                        setMarginTop(-toolbarHeight)
                    }
                } else {
                    dy = dy + setMarginTop(null, null, true);
                    if (-dy <= toolbarHeight && dy <= 0) {
                        setMarginTop(dy)
                    } else {
                        setMarginTop(0)
                    }
                }
            },
            onPanResponderRelease: (e, gesture) => {
                // console.log('onPanResponderRelease\n======')
            },
            onPanResponderTerminationRequest: (evt, gesture) => {
                // console.log('onPanResponderTerminationRequest')
                return true;
            },
            onPanResponderTerminate: (evt, gesture) => {
                // console.log('onPanResponderTerminate')
            },
            onShouldBlockNativeResponder: (evt, gesture) => {
                // console.log('onShouldBlockNativeResponder')
                return false;
            },
            onPanResponderReject: (evt, gesture) => {
                // console.log('onPanResponderReject')
                return false;
            },
            onPanResponderEnd: (evt, gesture) => {
                // console.log('onPanResponderEnd')
                let dy = gesture.dy;
                let vy = gesture.vy;

                setMarginTop(null, true)
            },

        });
    }

    onSegmentedViewChange = (segmentedIndex) => {
        this.viewPage.setPage(segmentedIndex);
    }

    _renderTitle(title, i) {
        return (
            <View style={[styles.title, {
                backgroundColor: this.props.modeInfo.standardColor,
                flexDirection: 'row'
            }]
            }>
                <Text style={[this.props.titleStyle, {
                    flex: 1,
                    height: 30,
                    textAlign: 'center',
                    lineHeight: 25
                }]}>{title}</Text>
            </View>
        );
    }

    renderTitle(title, i) {
        return (
            <View collapsable={false} key={i} ref={i} style={{ flex: this.props.stretch ? 1 : 0 }}>
                <TouchableNativeFeedback
                    delayPressIn={0}
                    onPress={() => this.onSegmentedViewChange(i)}
                    underlayColor={this.props.underlayColor}
                >
                    {this.props.renderTitle ? this.props.renderTitle(title, i) : this._renderTitle(title, i)}
                </TouchableNativeFeedback>
            </View>
        );
    }

    _onPageSelected = (event) => {
        const { navigator } = this.props;
        isScrollByClickSegmentedButton = false;
        let segmentedIndex = event.nativeEvent.position;
    }

    onPageScroll = ({ nativeEvent }) => {
        const { titleWidth, navigator, restWidth } = this.props;

        if (isScrollByClickSegmentedButton == true) {
            return;
        }

        let left = titleWidth * (nativeEvent.position + nativeEvent.offset) + restWidth;

        this.state.fadeAnim.setOffset(left);
        this.state.fadeAnim.setValue(0);

        if (direction == '') {
            direction = nativeEvent.offset * 2 > 1 ? 'left' : 'right';
        }
        let fromIndex, toIndex;
        if (direction == 'left') {
            fromIndex = nativeEvent.position + 1,
                toIndex = nativeEvent.position;
        } else {
            fromIndex = nativeEvent.position;
            toIndex = nativeEvent.position + 1;
        }

        this.props.scrollTo(fromIndex, toIndex, nativeEvent.offset)

    }

    onPageScrollStateChanged = (scrollingState) => {
        if (scrollingState == 'dragging') {
            isScrollByClickSegmentedButton = false;
        } else if (scrollingState == 'settling') {


        } else if (scrollingState == 'idle') {
            const { titleWidth } = this.props;

            let fadeAnim = this.state.fadeAnim;
            fadeAnim.flattenOffset();
            let currentLeft = fadeAnim._value;
            let segmentedIndex = parseInt(currentLeft / titleWidth);

            direction = '';

            let dispatch = this.props.toolbarDispatch;
            let fromIndex = this.props.segmentedIndex;
            dispatch(changeSegmentIndex(segmentedIndex));
            if (isScrollByClickSegmentedButton == true) {
                this.props.switchTo(fromIndex, segmentedIndex);
            }
        }
    }

    render() {

        let items = [];
        let titles = this.props.titles;

        if (!this.props.stretch) {
            items.push(<View key={`s`} style={styles.spacer} />);
        }

        for (let i = 0; i < titles.length; i++) {
            items.push(this.renderTitle(titles[i], i));
            if (!this.props.stretch) {
                items.push(<View key={`s${i}`} style={styles.spacer} />);
            }
        }
        //{...this.panResponder.panHandlers}
        return (
            <View
                style={{ height: thisScreenHeightWitoutStatusBar }}

            >
                <View
                    {...{ navigator: this.props.navigator }}
                    {...this.moveUpPanResponder.panHandlers}
                    style={[styles.container, this.props.style, {
                        elevation: 4,
                        height: segmentedHeight,
                    }]}>
                    <View style={styles.titleContainer}>
                        {items}
                    </View>
                    <View
                        style={[styles.barContainer, { backgroundColor: 'transparent', position: 'absolute', bottom: -2, width: SCREEN_WIDTH}]}>
                        <Animated.View
                            style={[
                                { left: this.state.fadeAnim },
                                { width: this.props.titleWidth - this.props.restWidth * 2  },
                                { height: 4, backgroundColor: this.props.modeInfo.backgroundColor, }
                            ]}>
                        </Animated.View>
                    </View>
                </View>
                <ViewPagerAndroid style={{
                    height: viewPagerHeight,
                    flexDirection: 'row',
                    backgroundColor: '#FAFAFA',
                    alignItems: 'center',
                    paddingHorizontal: 2,
                    paddingVertical: 8
                }
                }
                    ref={viewPager => { this.viewPage = viewPager; }}
                    keyboardDismissMode={"on-drag"}
                    onPageSelected={this._onPageSelected}
                    onPageScrollStateChanged={this.onPageScrollStateChanged}
                    onPageScroll={this.onPageScroll}
                >

                    <View key={`s00`}
                        style={{ backgroundColor: 'blue', height: 500 }}

                    >
                        <Community
                            index={0}
                            ref={community => this.community = community}
                            {...{
                                navigator: this.props.navigator,
                                communityType: this.props.communityType,
                                modeInfo: this.props.modeInfo,
                                setMarginTop: this.props.setMarginTop
                            }
                            }
                        />
                    </View>

                    <View key={`s11`}>
                        <Qa
                            index={1}
                            ref={qa => this.qa = qa}
                            {...{
                                navigator: this.props.navigator,
                                modeInfo: this.props.modeInfo,
                                setMarginTop: this.props.setMarginTop
                            }}
                            URL={'http://psnine.com/qa'}
                        />
                    </View>
                    {/*<View key={`s22`}>
                        <Game
                            ref={game => this.game = game}
                            index={2}
                            {...{
                                navigator: this.props.navigator, modeInfo: this.props.modeInfo,
                                setMarginTop: this.props.setMarginTop
                            }}
                            URL={'http://psnine.com/psngame'}
                        />
                    </View>
                    <View key={`s33`}>
                        <Battle
                            index={3}
                            ref={battle => this.battle = battle}
                            {...{
                                navigator: this.props.navigator, modeInfo: this.props.modeInfo,
                                setMarginTop: this.props.setMarginTop,
                            }}
                            URL={'http://psnine.com/battle'}
                        />
                    </View>
                    <View key={`s44`}>
                        <Gene
                            ref={gene => this.gene = gene}
                            index={4}
                            {...{
                                navigator: this.props.navigator,
                                geneType: this.props.geneType,
                                modeInfo: this.props.modeInfo,
                                setMarginTop: this.props.setMarginTop
                            }
                            }
                        />
                    </View>*/}

                </ViewPagerAndroid>
            </View>
        );
    }
}


export default SegmentedView;
