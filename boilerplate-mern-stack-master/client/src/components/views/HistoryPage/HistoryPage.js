import React, {useEffect, useState} from 'react'
import { useDispatch } from 'react-redux';
import { deletehistory } from '../../../_actions/user_actions'

function HistoryPage(props) {

    const [DeleteHistory, setDeleteHistory] = useState([])

    const dispatch = useDispatch();

   

   

    const Historydelete = (historyId) => {
        dispatch(deletehistory(historyId))
        .then(response => {
            if(response.payload.success){
            

            }
    })
}


const rednerHistory = () => (
    props.user.userData && 
                props.user.userData.history.map(item => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.price}</td>
                        <td>{item.quantity}</td>
                        <td>{item.dateOfPurchase}</td>
                        <td>
                        <button onClick={() => Historydelete(item.id)}>
                         Remove
                        </button>
                        </td>
                    </tr>
                  ))
)

   


    return (
        <div style={{width: '80%', margin: '3rem auto'}}>
            <div style={{ textAlign: 'center'}}>
                <h1>History</h1>
            </div>
            <br />

            <table>
                <thead>
                    <tr>
                        <th>Payment Id</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Date of Purchase</th>
                        <th>Delete</th>
                    </tr>
                </thead>

                <tbody>
                    {rednerHistory()}
                </tbody>

            </table>
            
        </div>
    )
}

export default HistoryPage
