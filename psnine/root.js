import React from 'react'
import {
	Navigator,
	BackAndroid,
	Dimensions,
	ToastAndroid,
} from 'react-native';
import { Provider } from 'react-redux'

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
		  ToastAndroid.show('再按一次退出',2000);
	      return true;
	    }else{
	      return false;
	    }
	}
});

const SCREEN_WIDTH = Dimensions.get('window').width;
let BaseConfig = Navigator.SceneConfigs.FloatFromRight;

let CustomGesture = Object.assign({}, BaseConfig.gestures.pop, { 
	snapVelocity: 8, 
	edgeHitWidth: SCREEN_WIDTH,
	gestureDetectMovement:2,
  	stillCompletionRatio: 3 / 10,
	directionRatio: 1,
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
				<Navigator
					initialRoute={{ component: App }}
					configureScene={(route) => {
						return CustomSceneConfig;
					} }
					renderScene={this.renderScene.bind(this) } />
			</Provider>
		);
	}
}

export default Root;