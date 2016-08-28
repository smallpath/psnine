import * as ActionTypes from '../constants/actionTypes';

const initialState = {
    genePage: 0,
    genes: [],
    isRefreshing: false,
    isLoadingMore: false,
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
                    genePage: state.topicPage + 1,
                });
            }
            return newState;

        case ActionTypes.GENE_IS_REFRESHING:
            newState = Object.assign({},state,{
                isRefreshing: action.value,
                genes: [].concat(state.genes),
            });
            return newState;

        case ActionTypes.GENE_IS_LOADINGD_MORE:
            newState = Object.assign({},state,{
                isLoadingMore: action.value,
                genes: [].concat(state.genes),
            });
            return newState;


        default:
            return state;
    }
}

export default reducer;