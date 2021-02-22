import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_TO_CART,
    GET_CART_ITEMS,
    REMOVE_CART_ITEM,
    ON_SUCCESS_BUY,
    DELETE_HISTORY
} from '../_actions/types';
 

export default function(state={},action){
    switch(action.type){
        case REGISTER_USER:
            return {...state, register: action.payload }
        case LOGIN_USER:
            return { ...state, loginSucces: action.payload }
        case AUTH_USER:
            return {...state, userData: action.payload }
        case LOGOUT_USER:
            return {...state }
        case ADD_TO_CART:
            return {...state, 
                   userData: {
                       ...state.userData,   //state에 있는 userData또한 필요하기 때문이다.
                       cart: action.payload //
                   }
                }
        case  GET_CART_ITEMS:
            return {...state, cartDetail: action.payload }
        case  REMOVE_CART_ITEM:
            return {...state, cartDetail: action.payload.productInfo, 
                              userData: {
                                  ...state.userData,        //마찬가지로 삭제 후 업데이트 된 정보를
                                  cart: action.payload.cart// 카트를 담을때처럼 다시 합쳐준다.
                              }}
        case  ON_SUCCESS_BUY:
            return {...state, cartDetail: action.payload.cartDetail,
            userData:{...state.userData, cart: action.payload.cart}} 
        case  DELETE_HISTORY:
            return {...state,  userData: 
                action.payload.historyInfo
            }                          
        default:
            return state;
    }
}