import React, {useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { getCartItems } from '../../../_actions/user_actions'


function CartPage(props) {
    const dispatch = useDispatch();


    useEffect(() => {

        let cartItem=[] //여기에 여러 상품 id 값을 받는다.

       //리덕스 User state안에 cart 안에 상품이 들어있는지 확인
       if(props.user.userData && props.user.userData.cart)
       if(props.user.userData.cart.length > 0){
           props.user.userData.cart.forEach(item => {
                cartItem.push(item.id)
           })

           dispatch(getCartItems(cartItem, props.user.userData.cart))

       }
    }, [])
    return (
        <div>
            CartPage
        </div>
    )
}

export default CartPage
