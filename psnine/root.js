import React from 'react'
import {
	Navigator,
	BackAndroid,
	Dimensions,
	ToastAndroid,
	StatusBar,
	View,
} from 'react-native';
import { Provider } from 'react-redux'
import { deepColor } from './config/config';

import configureStore from './store/store.js'
import App from './containers/App.js'

const store = configureStore();

let _navigator;
let backPressClickTimeStamp = 0;
BackAndroid.addEventListener('hardwareBackPress', function () {
	if (_navigator && _navigator.getCurrentRoutes().length > 1) {
		_navigator.pop();
		return true;
	}else{
		var timestamp = (new Date()).valueOf();
	    if(timestamp - backPressClickTimeStamp>2000){
	      backPressClickTimeStamp = timestamp;
		  ToastAndroid.show('再按一次退出程序',2000);
	      return true;
	    }else{
	      return false;
	    }
	}
});

const { width:SCREEN_WIDTH, height:SCREEN_HEIGHT } = Dimensions.get('window');

let BaseConfig = Navigator.SceneConfigs.FloatFromRight;

let CustomGesture = Object.assign({}, BaseConfig.gestures.pop, { 
	isDetachable: true,
	snapVelocity: 8, 
	edgeHitWidth: SCREEN_WIDTH,
	// set it from 3(Default) to 12 to ignore Navigator gestures being triggerred 
	// because Navigator gesture will be triggerred first when there is another components
	// which has scroll abiliy, such as ScrollView and WebView
	gestureDetectMovement:12,	
  	stillCompletionRatio: 3 / 10,
	directionRatio: 2,
	fullDistance: SCREEN_WIDTH/2
});


let CustomSceneConfig = Object.assign({}, BaseConfig, {  
	gestures: { pop: CustomGesture }
});

class Root extends React.Component {
	renderScene(route, navigator) {
		let Component = route.component;
		_navigator = navigator;
		return <Component {...route.params} navigator={navigator} />
	}
	render() {
		return (
			<Provider store={ store }>
				 <View> 
				 	<StatusBar translucent={false} backgroundColor={deepColor} barStyle="light-content" />
					<Navigator
						initialRoute={{ component: App }}
						configureScene={route => CustomSceneConfig }
						renderScene={this.renderScene.bind(this) } 
						style={{width:SCREEN_WIDTH, height:SCREEN_HEIGHT-StatusBar.currentHeight}}/>
				 </View>
			</Provider>
		);
	}
}

export default Root;