import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableHighlight,
    Dimensions,
} from 'react-native';

var screen = Dimensions.get('window');
var tweenState = require('react-tween-state');

var styles = StyleSheet.create({
    container: {

    },
    titleContainer: {
        flexDirection: 'row',
    },
    title: {
        flex: 1,
        backgroundColor: '#00a2ed',
        alignItems: 'center',
        paddingHorizontal: 2,
        paddingVertical: 10,
    },
    spacer: {
        flex: 1,
    },
    barContainer: {
        height: 4,
        position: 'relative',
        backgroundColor: '#00a2ed',
    },
    bar: {
        backgroundColor: '#00f',
        position: 'absolute',
        height: 4,
    }
});


var SegmentedView = React.createClass({

    mixins: [tweenState.Mixin],

    propTypes: {
        duration: PropTypes.number,
        onTransitionStart: PropTypes.func,
        onTransitionEnd: PropTypes.func,
        onPress: PropTypes.func,
        renderTitle: PropTypes.func,
        titles: PropTypes.array,
        index: PropTypes.number,
        barColor: PropTypes.string,
        barPosition: PropTypes.string,
        underlayColor: PropTypes.string,
        stretch: PropTypes.bool,
        selectedTitleStyle: PropTypes.object,
        titleStyle: PropTypes.object,

    },

    getDefaultProps() {
        return {
            duration: 200,
            onTransitionStart: ()=>{},
            onTransitionEnd: ()=>{},
            onPress: ()=>{},
            renderTitle: null,
            index: 0,
            barColor: '#44B7E1',
            barPosition:'top',
            underlayColor: '#CCCCCC',
            stretch: false,
            selectedTextStyle: null,
            textStyle: null,
        };
    },

    getInitialState() {
        return {
            barPosition: [0, screen.width],
            titleWidth: 0,
        };
    },

    componentDidMount() {
        setTimeout(() => this.moveTo(this.props.index), 0);
    },

    componentWillReceiveProps(nextProps) {
        this.moveTo(nextProps.index);
    },

    measureHandler(ox, oy, width,height,pageX,pageY) {

        this.tweenState(['barPosition',0], {
            easing: tweenState.easingTypes.easeInOutQuad,
            stackBehavior: tweenState.stackBehavior.DESTRUCTIVE,
            duration: this.props.duration,
            endValue: pageX
        });

        this.setState({
            titleWidth : width,
        });
    },

    moveTo(index) {
        this.refs[index].measure(this.measureHandler);
    },

    _renderTitle(title, i) {
        return (
            <View style={styles.title}>
                <Text style={[this.props.titleStyle, i === this.props.index && this.props.selectedTitleStyle]}>{title}</Text>
            </View>
        );
    },

    renderTitle(title, i) {
        return (
            <View collapsable={false} key={i} ref={i} style={{ flex: this.props.stretch ? 1 : 0 }}>
                <TouchableHighlight underlayColor={this.props.underlayColor} onPress={() => this.props.onPress(i)}>
                    {this.props.renderTitle ? this.props.renderTitle(title, i) : this._renderTitle(title, i)}
                </TouchableHighlight>
            </View>
        );
    },

    render() {
        var items = [];
        var titles = this.props.titles;

        if (!this.props.stretch) {
            items.push(<View key={`s`} style={styles.spacer} />);
        }

        for (var i = 0; i < titles.length; i++) {
            items.push(this.renderTitle(titles[i], i));
            if (!this.props.stretch) {
                items.push(<View key={`s${i}`} style={styles.spacer} />);
            }
        }
        var left = this.getTweeningValue(['barPosition',0]);
        var right = this.getTweeningValue(['barPosition',1]);
        var barContainer = (
          <View style={styles.barContainer}>
              <View ref="bar" style={[styles.bar, {
                  left: left+5,
                  width:this.state.titleWidth-5,
                  backgroundColor: this.props.barColor
              }]} 
              />
          </View>
        );
        return (
            <View {...this.props} style={[styles.container, this.props.style]}>
                {this.props.barPosition == 'top' && barContainer}
                <View style={styles.titleContainer}>
                    {items}
                </View>
                {this.props.barPosition == 'bottom' && barContainer}  
            </View>
        );
    }
});

module.exports = SegmentedView;
