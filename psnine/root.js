import React from 'react'
import {
	Navigator,
	BackAndroid,
	Dimensions,
	ToastAndroid,
	StatusBar,
	View,
	Animated,
	Text,
	Easing
} from 'react-native';
import { Provider } from 'react-redux'
import {
	accentColor,
	deepColor, standardColor, tintColor,
	nightDeepColor, nightStandardColor, nightTintColor,

	backgroundColor, nightBackgroundColor,
	backgroundColorBrighterLevelOne,
	nightBackgroundColorBrighterLevelOne,
	standardTextColor, nightStandardTextColor,
	titleTextColor, nightTitleTextColor

} from './config/colorConfig';

import PushWithoutAnimation from './utils/PushWithoutAnimation';

import configureStore from './store/store.js'
import App from './containers/App.js'

import moment from './utils/moment';

import About from './components/About'

const store = configureStore();

let _navigator;
let backPressClickTimeStamp = 0;
// const listeners = BackAndroid.addEventListener('hardwareBackPress', function () {
// 	if (_navigator && _navigator.getCurrentRoutes().length > 1) {
// 		_navigator.pop();
// 		return true;
// 	}else{
// 		let timestamp = new Date();
// 	    if(timestamp - backPressClickTimeStamp>2000){
// 	      backPressClickTimeStamp = timestamp;
// 		  global.toast && global.toast('再按一次退出程序',2000);
// 	      return true;
// 	    }else{
// 	      return false;
// 	    }
// 	}
// });

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

let BaseConfig = Navigator.SceneConfigs.PushFromRight;

let FloatFromBottom = Navigator.SceneConfigs.FloatFromBottomAndroid;

let CustomGesture = Object.assign({}, BaseConfig.gestures.pop, {
	isDetachable: true,
	snapVelocity: 8,
	edgeHitWidth: SCREEN_WIDTH,
	// set it from 3(Default) to 12 to ignore Navigator gestures being triggerred 
	// because Navigator gesture will be triggerred first when there is another components
	// which has scroll abiliy, such as ScrollView and WebView
	gestureDetectMovement: 12,
	stillCompletionRatio: 3 / 10,
	directionRatio: 2,
	fullDistance: SCREEN_WIDTH / 2,
	direction: 'left-to-right',
});


let CustomSceneConfig = Object.assign({}, BaseConfig, {
	gestures: { pop: CustomGesture }
});

let CustomPushWithoutAnimation = Object.assign({}, PushWithoutAnimation.NONE, {
	gestures: { pop: CustomGesture }
})

let toolbarHeight = 56
const tipHeight = toolbarHeight * 0.8

class Root extends React.Component {
	constructor(props) {
		super(props);

		let hour = ~~moment().format('HH');

		this.state = {
			text: '',
			isNightMode: hour >= 22 || hour < 7,
			tipBarMarginBottom: new Animated.Value(0)
		};

		this.dayModeInfo = {
			isNightMode: false,
			accentColor: accentColor,
			deepColor: deepColor,
			standardColor: standardColor,
			tintColor: tintColor,
			backgroundColor: backgroundColor,
			brighterLevelOne: backgroundColorBrighterLevelOne,
			standardTextColor: standardTextColor,
			titleTextColor: titleTextColor
		}

		this.nightModeInfo = {
			isNightMode: true,
			accentColor: accentColor,
			deepColor: nightDeepColor,
			standardColor: nightStandardColor,
			tintColor: nightTintColor,
			backgroundColor: nightBackgroundColor,
			brighterLevelOne: nightBackgroundColorBrighterLevelOne,
			standardTextColor: nightStandardTextColor,
			titleTextColor: nightTitleTextColor,
		}
	}

	switchModeOnRoot = () => {
		let targetState = !this.state.isNightMode;
		this.setState({
			isNightMode: targetState,
		});
		return targetState;
	}

	componentWillMount() {
		global.toast = this.toast
		const listeners = BackAndroid.addEventListener('hardwareBackPress', function () {
			if (_navigator && _navigator.getCurrentRoutes().length > 1) {
				_navigator.pop();
				return true;
			} else {
				let timestamp = new Date();
				if (timestamp - backPressClickTimeStamp > 2000) {
					backPressClickTimeStamp = timestamp;
					global.toast && global.toast('再按一次退出程序');
					return true;
				} else {
					return false;
				}
			}
		});
	}

	toast = (text) => {
		const value = this.state.tipBarMarginBottom._value
		if (value === 0) {
			this.setText(text)
		} else {
			setTimeout(() => {
				this.toast(text)
			}, 3000)
		}
	}

	setText = (text) => {
		this.setState({
			text
		})
		Animated.timing(this.state.tipBarMarginBottom, {
			toValue: this.state.tipBarMarginBottom._value === 1 ? 0 : 1,
			duration: 200,
			easing: Easing.ease,
		}).start();

		setTimeout(() => {
			Animated.timing(this.state.tipBarMarginBottom, {
				toValue: this.state.tipBarMarginBottom._value === 1 ? 0 : 1,
				duration: 200,
				easing: Easing.ease,
			}).start();
		}, 2000)
	}

	renderScene = (route, navigator) => {
		let Component = route.component;
		_navigator = navigator;
		global.topNavigator = navigator
		return <Component {...route.params}
			modeInfo={this.state.isNightMode ? this.nightModeInfo : this.dayModeInfo}
			switchModeOnRoot={this.switchModeOnRoot}
			tipBarMarginBottom={this.state.tipBarMarginBottom}
			navigator={navigator} />
	}
	configureScene = (route) => {
		if (typeof route.withoutAnimation != 'undefined') {
			if (route.withoutAnimation == true) {
				return CustomPushWithoutAnimation;
			}
		}
		return CustomSceneConfig
	}
	render() {
		const modeInfo = this.state.isNightMode ? this.dayModeInfo : this.nightModeInfo
		return (
			<Provider store={store}>
				<View style={{ flex: 1 }}>
					<StatusBar translucent={false} backgroundColor={this.state.isNightMode ? nightDeepColor : deepColor} barStyle="light-content" />
					<Navigator
						initialRoute={{ component: App, shouldBeClickableUnderOtherRoutes: true }}
						configureScene={this.configureScene}
						renderScene={this.renderScene}
						style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT - StatusBar.currentHeight }} />
					<Animated.View style={{
						height: tipHeight,
						position: 'absolute',
						bottom: this.state.tipBarMarginBottom.interpolate({
							inputRange: [0, 1],
							outputRange: [-tipHeight, 0]
						}),
						elevation: 6,
						width: SCREEN_WIDTH,
						backgroundColor: modeInfo.backgroundColor
					}}>
						<View style={{
							flex: 1,
							justifyContent: 'center',
							padding: 20
						}}>
							<Text style={{
								fontSize: 15,
								color: modeInfo.titleTextColor
							}}>{this.state.text}</Text>
						</View>
					</Animated.View>
				</View>
			</Provider>
		);
	}
}

export default Root;