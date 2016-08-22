import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

import MainScreen from './psnine/containers/MainScreen';

class entry extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <MainScreen/>
        )
    }
}

AppRegistry.registerComponent('Psnine', () => entry);