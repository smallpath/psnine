import React from 'react'
import {
	Navigator,
	BackAndroid,
	Dimensions,
} from 'react-native';
import { Provider } from 'react-redux'

import configureStore from './store/store.js'
import App from './containers/App.js'

const store = configureStore();

let _navigator;
BackAndroid.addEventListener('hardwareBackPress', function () {
	if (_navigator && _navigator.getCurrentRoutes().length > 1) {
		_navigator.pop();
		return true;
	}
	return false;
});

const SCREEN_WIDTH = Dimensions.get('window').width;
let BaseConfig = Navigator.SceneConfigs.FloatFromRight;

let CustomGesture = Object.assign({}, BaseConfig.gestures.pop, {  
	// Make it snap back really quickly after canceling pop
	snapVelocity: 8, 
	// Make it so we can drag anywhere on the screen
	edgeHitWidth: SCREEN_WIDTH,
	// The min distance to be moving
	gestureDetectMovement:3,
	fullDistance: SCREEN_WIDTH/4,
	// directionRatio:0.33,
});

// Object.keys(CustomGesture).forEach((item,index)=>console.log(item,CustomGesture[item]));

let CustomSceneConfig = Object.assign({}, BaseConfig, {  
	// A very tightly wound spring will make this transition fast
	// springTension: 0, 
	// springFriction: 0,  
	// Use our custom gesture defined above
	gestures: { pop: CustomGesture, }
});

class Root extends React.Component {
	renderScene(route, navigator) {
		let Component = route.component;
		_navigator = navigator;
		return <Component {...route.params} navigator={navigator} />
		//  上面的route.params 是为了方便后续界面间传递参数用的
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