import {
  Easing,
  Animated
} from 'react-native'
function forInitial(props) {
  const {
    navigation,
    scene,
  } = props;

  const focused = navigation.state.index === scene.index;
  const opacity = focused ? 1 : 0;
  // If not focused, move the scene far away.
  const translate = focused ? 0 : 1000000;
  return {
    opacity,
    transform: [{ translateX: translate }, { translateY: translate }],
  };
}

export default function (
  transitionProps,
  prevTransitionProps,
  isModal,
) {
  return {
    transitionSpec: {
      duration: 350,
      easing: Easing.out(Easing.poly(5)), // decelerate
      timing: Animated.timing,
    },
    screenInterpolator: function(props) {
      const {
        layout,
        position,
        scene,
        navigation
      } = props;

      if (!layout.isMeasured) {
        return forInitial(props);
      }

      let index = scene.index;

      const prev = prevTransitionProps.scenes && prevTransitionProps.scenes[index + 1]
      if (scene && scene.isStable && prev && prev.route) {
        if (prev.route.params.shouldSeeBackground === true) {
          return {
            opacity: 1
          }
        }
      }

      const params = (navigation.state.routes[navigation.state.index] || {}).params || {}

      if (params.shouldSeeBackground === true) {
        if (scene.index === navigation.state.index) {

        } else if (scene.index + 1 == navigation.state.index) {
          return {
            opacity: 1
          }
        }
      }

      // if (scene && scene.route) {
      //   const { params = {} } = scene.route
      //   if (params.shouldSeeBackground) {
      //     // return {
      //     //   backgroundColor: 'transparent',
      //     //   opacity: 99
      //     // }
      //   }
      // }

      const inputRange = [index - 1, index, index + 0.99, index + 1];
      // console.log(inputRange)
      const opacity = position.interpolate({
        inputRange,
        outputRange: ([0, 1, 1, 0]),
      });

      const translateX = 0;
      const translateY = position.interpolate({
        inputRange,
        outputRange: ([50, 0, 0, 0]),
      });

      return {
        opacity,
        transform: [{ translateX }, { translateY }],
      };
    }
  }
}