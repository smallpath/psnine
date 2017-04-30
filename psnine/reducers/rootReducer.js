import { combineReducers } from 'redux';
import app from './App';
import battle from './Battle';
import community from './Community';
import gene from './Gene';
import qa from './Qa';

const rootReducer = combineReducers({
    app,
    battle,
    community,
    gene,
    qa
});

export default rootReducer;