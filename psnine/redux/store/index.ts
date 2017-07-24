import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducer/index'
// import createLogger from 'redux-logger'

const middlewares = [thunk]

// if (process.env.NODE_ENV === `development`) {
//   const createLogger = require(`redux-logger`);
//   const logger = createLogger();
//   middlewares.push(logger);
// }

export default function configureStore(initialState?) {
  const store = compose(applyMiddleware(...middlewares))(createStore)(rootReducer, initialState)
  return store
}