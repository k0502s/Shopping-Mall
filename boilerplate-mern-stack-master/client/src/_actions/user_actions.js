import Axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_TO_CART,
    GET_CART_ITEMS,
    REMOVE_CART_ITEM
} from './types';
import { USER_SERVER } from '../components/Config.js';

export function registerUser(dataToSubmit){
    const request = Axios.post(`${USER_SERVER}/register`,dataToSubmit)
        .then(response => response.data);
    
    return {
        type: REGISTER_USER,
        payload: request
    }
}

export function loginUser(dataToSubmit){
    const request = Axios.post(`${USER_SERVER}/login`,dataToSubmit)
                .then(response => response.data);

    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function auth(){
    const request = Axios.get(`${USER_SERVER}/auth`)
    .then(response => response.data);

    return {
        type: AUTH_USER,
        payload: request
    }
}

export function logoutUser(){
    const request = Axios.get(`${USER_SERVER}/logout`)
    .then(response => response.data);

    return {
        type: LOGOUT_USER,
        payload: request
    }
}

export function addToCart(id){

    let body = {
        productId: id
    }

    const request = Axios.post(`${USER_SERVER}/addToCart`, body)
    .then(response => response.data);

    return {
        type: ADD_TO_CART,
        payload: request
    }
}


export function getCartItems(cartItems, userCart){


                                                            //서버에서 req.query 부분
    const request = Axios.get(`/api/product/products_by_id?id=${cartItems}&type=array`)
    .then(response =>{
            //CartItem 들에 해당하는 정보들을 product Collection에서 가져온 후에

            //Quantity 정보를 넣어 준다. 즉 product 정보와, cart 정보의 Quantity의 조합이다.
            userCart.forEach(cartItem => {
                response.data.forEach((productDetail, index) => {
                    if(cartItem.id === productDetail._id) {
                        response.data[index].quantity = cartItem.quantity
                    }
                })
            })
            return response.data;
    });
    return {
        type: GET_CART_ITEMS,
        payload: request
    }
}

export function removeCartItem(productId){

   
                                                        //서버에서 req.query 부분
    const request = Axios.get(`/api/users/removeFromCart?id=${productId}`)
    .then(response =>{
            
        //productInfo, cart 정보를 조합해서 CartDetail을 만든다.

 //이미 서버쪽에서 원하는 정보를 삭제하였고 원래 카트에 담을 때도 합쳤으므로 다시 합쳐서 데이터를 보내준다.
        response.data.cart.forEach(item => {
            response.data.productInfo.forEach((product, index) => {
                if(item.id === product._id){
                    response.data.productInfo[index].quantity = item.quantity
                }
            })
        })
            return response.data;
    });
    return {
        type: REMOVE_CART_ITEM,
        payload: request
    }
}



