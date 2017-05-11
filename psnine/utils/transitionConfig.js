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

const hack = {
  prevTransitionProps: {}
}

const hackIndex = 0

export function onTransitionStart(transitionProps, prevTransitionProps) {
  hack.prevTransitionProps = transitionProps
}

export function transitionConfig(
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
    screenInterpolator: function (props) {
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

      // transitionConfig拿不到上一次的过渡属性, 得靠onTransitionStart来hack一下
      const prev = hack.prevTransitionProps.scenes && hack.prevTransitionProps.scenes[index + 1]

      if (scene && scene.isActive && prev && prev.route) {
        // 退出时, 如果这个界面是Active且之前的界面有shouldSeeBackground属性, 那么定死1以避免白色闪屏
        if (prev.route.params && prev.route.params.shouldSeeBackground === true) {
          return {
            opacity: 1
          }
        }
      }

      const params = (navigation.state.routes[navigation.state.index] || {}).params || {}

      if (params.shouldSeeBackground === true) {
        if (scene.index === navigation.state.index) {
          return {
            opacity: 1
          }
        } else if (scene.index + 1 == navigation.state.index) {
          return {
            opacity: 1
          }
        }
      }

      const inputRange = [index - 1, index, index + 0.99, index + 1];

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