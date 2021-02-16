import React,{useState} from 'react'
import {Collapse, Radio} from 'antd';

const { Panel } = Collapse;

function RadioBox(props) {

const [Value, setValue] = useState(0)

              //{}대신 ()가 들어간 이유는 무조건 랜더링 부분만 들어 갈 수 있기 때문이다.
              //{}는 조건절도 들어갈 수 있다.
const renderRadioBox = () => (
    props.list && props.list.map(value => (
        <Radio key={value._id} value={value._id}>{value.name}</Radio>
    ))
)

const handleChange = (e) => {
    setValue(e.target.value)
    props.handleFilters(e.target.value) //props을 이용해 부모에게 정보 전달
}
    return (
        <div>
           <Collapse defaultActiveKey={['1']}>
             <Panel header="Price" key="1">
             <Radio.Group onChange={handleChange} value={Value}>
                {renderRadioBox()}
             </Radio.Group>   
             </Panel>
           </Collapse>
        </div>
    )
}

export default RadioBox
