import { combineReducers } from 'redux';
import app from './App';
import community from './Community';
import gene from './Gene';

const rootReducer = combineReducers({
    app,
    community,
    gene,
});

export default rootReducer;