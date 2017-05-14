import { combineReducers } from 'redux';
import app from './App';
import battle from './Battle';
import community from './Community';
import gene from './Gene';
import qa from './Qa';
import game from './Game';
import rank from './Rank';

const rootReducer = combineReducers({
  app,
  battle,
  community,
  gene,
  qa,
  game,
  rank
});

export default rootReducer;