import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getCartItems, removeCartItem } from '../../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';

function CartPage(props) {
    const dispatch = useDispatch();

    const [Total, setTotal] = useState(0)

    useEffect(() => {

        let cartItems=[] //여기에 여러 상품 id 값을 받는다.

       //리덕스 User state안에 cart 안에 상품이 들어있는지 확인
       if(props.user.userData && props.user.userData.cart)
       if(props.user.userData.cart.length > 0){
           props.user.userData.cart.forEach(item => {
                cartItems.push(item.id)
           })

           dispatch(getCartItems(cartItems, props.user.userData.cart))
           .then(response => {calculateTotal(response.payload)})

       }
    }, [props.user.userData])//useEffect가 처음 실행될때 useData가 없으므로 추가해주었다.

    let calculateTotal = (cartDetail) => {
        let total = 0;
        
        cartDetail.map(item => {
               //+=로 결과값들을 모두 더해줌 //parseInt로 스트링 문자를 숫자로 바꿔줌
            total += parseInt(item.price,10)*item.quantity
        })
            setTotal(total)
    }

    let removeFromCart = (productId) => {
            dispatch(removeCartItem(productId))
            .then(response => {

        })
    }

    return (
        <div style={{width: '85%', margin: '3rem auto'}}>
            <h1>My Cart</h1>

            <div>                       
         {/* props.user.cartDetail을 아직 가져오지 못했는데 product을 접근하여 오류가 뜨므로 아래와 같이 설정 */}
            <UserCardBlock products={props.user.cartDetail} removeItem={removeFromCart}/>
            </div>

            <div style={{marginTop: '3rem'}}>
                <h2>Total Amount: ${Total}</h2>

            </div>
           
        </div>
    )
}

export default CartPage
