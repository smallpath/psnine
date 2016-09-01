import { combineReducers } from 'redux';
import app from './App';
import battle from './Battle';
import community from './Community';
import gene from './Gene';

const rootReducer = combineReducers({
    app,
    battle,
    community,
    gene,
});

export default rootReducer;