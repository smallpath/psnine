'use strict';

import React, {
    Navigator
} from 'react-native';

const buildStyleInterpolator = require('buildStyleInterpolator');

let NoTransition = {
  opacity: {
    value: 1.0,
    type: 'constant',
  }
};

const PushWithoutAnimation = {
    NONE: {
        ...Navigator.SceneConfigs.FadeAndroid,
        defaultTransitionVelocity: 999,

        animationInterpolators: {
            into: buildStyleInterpolator(NoTransition),
            out: buildStyleInterpolator(NoTransition)
        }
    }
};

export default PushWithoutAnimation;