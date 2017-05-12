import React, { Component, Children } from 'react';
import {
  ScrollView,
  Dimensions,
  Platform,
  View,
  StyleSheet,
  TouchableNativeFeedback,
  Text
} from 'react-native';

import { changeSegmentIndex } from '../actions/app';

import Community from './drawer/Community';
import Qa from './drawer/Qa';
import Game from './drawer/Game';
import Battle from './drawer/Battle';
import Gene from './drawer/Gene';

import {
  DrawerNavigator,
  DrawerItems
} from 'react-navigation';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');



const RightDrawer = DrawerNavigator({
  Community: {
    screen: Community,
  },
  Qa: {
    screen: Qa,
  },
  Game: {
    screen: Game,
  },
  Battle: {
    screen: Battle,
  },
  Gene: {
    screen: Gene,
  }
}, {
  initialRouteName: 'Community',
  drawerWidth: SCREEN_WIDTH / 2,
  drawerPosition: 'right',
  contentComponent: props => {
    const {
      navigation,
      activeTintColor = '#2196f3',
      activeBackgroundColor = 'rgba(0, 0, 0, .54)',
      inactiveTintColor = 'rgba(0, 0, 0, .87)',
      inactiveBackgroundColor = 'transparent',
      getLabel,
      renderIcon,
      style,
      labelStyle,
      screenProps
    } = props
    
    return (
      <ScrollView style={{ backgroundColor: screenProps.modeInfo.backgroundColor }}>
        <View style={[styles.container, style]}>
          {navigation.state.routes.map((route: *, index: number) => {
            const focused = navigation.state.index === index;
            const color = focused ? screenProps.modeInfo.standardColor : screenProps.modeInfo.standardTextColor;
            const backgroundColor = focused
              ? screenProps.modeInfo.brighterLevelOne
              : screenProps.modeInfo.backgroundColor;
            const scene = { route, index, focused, tintColor: color };
            const icon = renderIcon(scene);
            const label = getLabel(scene);
            return (
              <TouchableItem
                key={route.key}
                onPress={() => {
                  navigation.navigate('DrawerClose');
                  screenProps.toolbarDispatch(changeSegmentIndex(index))
                  navigation.navigate(route.routeName);
                }}
                delayPressIn={0}
              >
                <View style={[styles.item, { backgroundColor }]}>
                  {icon
                    ? <View
                        style={[styles.icon, focused ? null : styles.inactiveIcon]}
                      >
                        {icon}
                      </View>
                    : null}
                  {typeof label === 'string'
                    ? <Text style={[styles.label, { color }, labelStyle]}>
                        {label}
                      </Text>
                    : label}
                </View>
              </TouchableItem>
            );
          })}
        </View>
      </ScrollView>
    )
  },
  backBehavior: 'none'
});

export default class RightDrawerContainer extends Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(prop, state) {
    if (prop.screenProps.modalVisible != this.props.screenProps.modalVisible) return false
    return true
  }

  render() {
    return (<RightDrawer
      {...this.props}
    />)
  }
}

const ANDROID_VERSION_LOLLIPOP = 21;
class TouchableItem extends Component {
  static defaultProps = {
    pressColor: 'rgba(0, 0, 0, .32)',
  };

  render() {
    /*
     * TouchableNativeFeedback.Ripple causes a crash on old Android versions,
     * therefore only enable it on Android Lollipop and above.
     *
     * All touchables on Android should have the ripple effect according to
     * platform design guidelines.
     * We need to pass the background prop to specify a borderless ripple effect.
     */
    if (
      Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_LOLLIPOP
    ) {
      const { style, ...rest } = this.props; // eslint-disable-line no-unused-vars

      return (
        <TouchableNativeFeedback
          {...rest}
          style={null}
          background={TouchableNativeFeedback.Ripple(
            this.props.pressColor,
            this.props.borderless,
          )}
        >
          <View style={this.props.style}>
            {Children.only(this.props.children)}
          </View>
        </TouchableNativeFeedback>
      );
    }

    return (
      <TouchableOpacity {...this.props}>
        {this.props.children}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    paddingVertical: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 16,
    width: 24,
    alignItems: 'center',
  },
  inactiveIcon: {
    /*
     * Icons have 0.54 opacity according to guidelines
     * 100/87 * 54 ~= 62
     */
    opacity: 0.62,
  },
  label: {
    margin: 16,
    fontWeight: 'bold',
  },
});