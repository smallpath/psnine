import React from 'react'
import {
	Navigator
} from 'react-native';
import { Provider } from 'react-redux'

import configureStore from './store/store.js'
import App from './containers/App.js'

const store = configureStore();

class Root extends React.Component {
	renderScene(route, navigator){
		let Component = route.component;
		return <Component {...route.params} navigator={navigator} />
		//  上面的route.params 是为了方便后续界面间传递参数用的
	}
	render() {
		return (
			<Provider store={ store }>
				<Navigator 
				    initialRoute={{ component: App }}
				    configureScene={(route) => {
				        return Navigator.SceneConfigs.FloatFromRight;
				    }}
				    renderScene={this.renderScene.bind(this)} />
			</Provider>
		);
	}
}

export default Root;