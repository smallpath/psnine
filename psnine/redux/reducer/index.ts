import { combineReducers } from 'redux'
import app from './app'
import battle from './battle'
import community from './community'
import gene from './gene'
import qa from './qa'
import game from './game'
import rank from './rank'
import circle from './circle'
import store from './store'
import trade from './trade'
import recommend from './recommend'
import discount from './discount'
import stats from './stats'

const rootReducer = combineReducers({
  app,
  battle,
  community,
  gene,
  qa,
  game,
  rank,
  circle,
  store,
  trade,
  recommend,
  discount,
  stats
})

export default rootReducer