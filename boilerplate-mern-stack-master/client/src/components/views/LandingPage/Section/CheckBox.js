import React, {useState} from 'react'
import {Collapse, Checkbox} from 'antd';

const { Panel } = Collapse;

function CheckBox(props) {

    const [Checked, setChecked] = useState([])


    //체크박스 누르면 발동
    const handleToggle = (value) => {
        //누른 것의 index을 구하고
        const currentIndex = Checked.indexOf(value) 
        //indexof메소드는 인자안에 들어가 있는 값이 Checked 배열 안에 없으면 index 값 대신 -1을 도출한다.

        //일단 전체 checked된 state를 newChecked에 변수 선언
        const newChecked = [...Checked]

        //index가 없으면 state에 넣어준다.
        if(currentIndex === -1) { //즉 Checked 배열안에 값이 없으면 발동 if문
            newChecked.push(value)
        //index가 있으면 따로 빼준다.
        }else{
            newChecked.splice(currentIndex, 1)
        }
        setChecked(newChecked)//결국 Checked 배열에 넣어준다.
        props.handleFilters(newChecked)//랜딩 페이지에도 정보를 전해주기 위하여 props의 성질을 통해 인자로 newChecked 값을 부모로 전달해줌
    }
                                    //props로 체크박스의 Data 모델들의 배열 값들을 가져온다.
    const renderDheckboxLists = () => props.list && props.list.map((value, index) => (
        <React.Fragment key={index}>
            <Checkbox onChange={() => handleToggle(value._id)} //체크박스를 누르면 해당 값의 id 값을 handleToggle의 인자로 보내줌
            //Checked의 배열 값 안에 해당 체크박스의 값이 없으면 눌러도 체크 표시를 안되게 설정하였다.
            checked={Checked.indexOf(value._id) === -1 ? false : true} />&nbsp;
                <span>{value.name}</span>&nbsp;&nbsp;&nbsp;
        </React.Fragment>
    ))

    
    return (
<div>
     <Collapse defaultActiveKey={['1']}>
             <Panel header="Continents" key="1">
                 {renderDheckboxLists()}
             </Panel>
     </Collapse>
</div>
    )
}

export default CheckBox
