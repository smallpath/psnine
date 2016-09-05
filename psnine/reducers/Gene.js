import * as ActionTypes from '../constants/actionTypes';

const initialState = {
    genePage: 0,
    genes: [],
}

function reducer(state = initialState, action){
    let newState = state;
    switch (action.type){
        case ActionTypes.GET_GENES_SUCCESS:
            if(action.page === 1) {
                newState = Object.assign({},state,{
                    genes: action.value.data,
                    genePage: 1,
                });
            } else{
                newState = Object.assign({},state,{
                    genes: state.genes.concat(action.value.data),
                    genePage: state.genePage + 1,
                });
            }
            return newState;

        default:
            return state;
    }
}

export default reducer;