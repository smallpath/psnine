import React from 'react'
import {
	BackHandler,
	Dimensions,
	ToastAndroid,
	StatusBar,
	View,
	Animated,
	Button,
	Text,
	Easing,
	InteractionManager
} from 'react-native';
import { Provider } from 'react-redux'
import {
	StackNavigator,
} from 'react-navigation';
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

import configureStore from './store/store.js'
import moment from './utils/moment';

const store = configureStore();

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

let toolbarHeight = 56
const tipHeight = toolbarHeight * 0.8

import App from './containers/App.js'

import Home from './containers/authPagers/Home'
import Login from './containers/authPagers/Login'
import Message from './containers/authPagers/Message'

import CommentList from './components/CommentList'
import CommunityTopic from './components/CommunityTopic'
import Reply from './components/new/Reply'

import Webview from './components/Webview'
import About from './components/About'
import ImageViewer from './components/imageViewer'

import NewTopic from './components/new/NewTopic'

const enableGesture = ({ navigation }) => {
	return {
		gesturesEnabled: true
	}
}

const Navigator = StackNavigator({
	Main: {
		screen: App
	},
  Login: {
		screen: Login,
    navigationOptions: enableGesture
	},
  Message: {
		screen: Message,
		navigationOptions: enableGesture
	},
  CommentList: {
		screen: CommentList,
    navigationOptions: enableGesture
	},
  CommunityTopic: {
		screen: CommunityTopic,
    navigationOptions: enableGesture
	},
	Reply: {
		screen: Reply
	},
  NewTopic: {
    screen: NewTopic
  },
  About: {
		screen: About,
    navigationOptions: enableGesture
	},
  Webview: {
		screen: Webview
	},
	ImageViewer: {
		screen: ImageViewer
	}
}, {
  initialRouteName: 'Main',
  headerMode: 'none',
  mode: 'card',
  navigationOptions: {
    cardStack: {
      gesturesEnabled: true,
    }
  },
});

let backPressClickTimeStamp = 0

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

	componentWillMount = () => {
		global.toast = this.toast
		const listeners = BackHandler.addEventListener('hardwareBackPress', () => {
      let timestamp = new Date();
      if (timestamp - backPressClickTimeStamp > 2000) {
        backPressClickTimeStamp = timestamp;
        global.toast && global.toast('再按一次退出程序');
        return true;
      } else {
        return false;
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
		InteractionManager.runAfterInteractions(() => {
			Animated.timing(this.state.tipBarMarginBottom, {
				toValue: this.state.tipBarMarginBottom._value === 1 ? 0 : 1,
				duration: 200,
				easing: Easing.ease
			}).start();
		});


		setTimeout(() => {
			InteractionManager.runAfterInteractions(() => {
				Animated.timing(this.state.tipBarMarginBottom, {
					toValue: this.state.tipBarMarginBottom._value === 1 ? 0 : 1,
					duration: 200,
					easing: Easing.ease
				}).start();
			});

		}, 2000)
	}

	render() {
		const modeInfo = this.state.isNightMode ? this.dayModeInfo : this.nightModeInfo
		return (
			<Provider store={store}>
				<View style={{ flex: 1 }}>
					<StatusBar translucent={false} backgroundColor={this.state.isNightMode ? nightDeepColor : deepColor} barStyle="light-content" />
					<Navigator onNavigationStateChange={null} screenProps={{
						modeInfo: this.state.isNightMode ? this.nightModeInfo : this.dayModeInfo,
						switchModeOnRoot: this.switchModeOnRoot,
						tipBarMarginBottom: this.state.tipBarMarginBottom
					}}/>
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

export default Root