import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/rootReducer';
const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

export default function configureStore(initialState){
    const store = createStoreWithMiddleware(rootReducer,initialState);

    if(module.hot){
        module.hot.accept('../reducers/rootReducer',()=>{
            const nextReducer = require('../reducers/rootReducer');
            store.replaceReducer(nextReducer);
        })
    }

    return store;
}