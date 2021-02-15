import React, {useState} from 'react'
import {Typography, Button, Form, Input} from 'antd';
import FileUpload from '../../utils/FileUpload'
import Axios from 'axios';

// const { Title } = Typography;

const { TextArea } = Input;

const Continents =[
    {key:1, value: "Arfica"},
    {key:2, value: "Europe"},
    {key:3, value: "Asia"},
    {key:4, value: "North America"},
    {key:5, value: "South America"},
    {key:6, value: "Australia"},
    {key:7, value: "Antarctica"}
]

function UploadProductPage(props) {

    const [Title, setTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Price, setPrice] = useState(0)
    const [Continent, setContinent] = useState(1)
    const [Images, setImages] = useState([])

    const titleChangeHandler = (e) => {
        setTitle(e.currentTarget.value)
    }

    const descriptionChangeHandler = (e) => {
        setDescription(e.currentTarget.value)
    }

    const priceChangeHandler = (e) => {
        setPrice(e.currentTarget.value)
    }

    const continentChangeHandler = (e) => {
        setContinent(e.currentTarget.value)
    }

    const updateImages = (newImages) => {
        setImages(newImages)
    }

    const submitHandler = (e) => {
        e.preventDefault();

        if(!Title || !Description || !Price || !Continent || !Images){
            return alert("빈 칸에 정보를 입력해야 합니다.")
        }

        //서버에 채운 값들을 request을 보낸다.
        const body = {
            //로그인된 사람의 ID
            writer:props.user.userData._id, //auth.js에서 가져옴
            title: Title,
            description: Description,
            price: Price,
            images: Images,
            continents: Continent
        }
        Axios.post("/api/product", body)
        .then(response => {
            if(response.data.success){
                alert('업로드 성공.')
                props.history.push('/')
            }else{
                alert('업로드 실패.')
            }
        })

    }

    return (
        <div style={{maxWidth: '700px', margin: '2rem auto'}}>
            <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                <h2>여행 상품 업로드</h2>
            </div>

            <Form onSubmit={submitHandler}>
              {/* DropZone   */}
              <FileUpload refreshFunction={updateImages}/>


              <br />
              <br />
              <label>이름</label>
              <Input onChange={titleChangeHandler} value={Title}/>
              <br />
              <br />
              <label>설명</label>
              <TextArea onChange={descriptionChangeHandler} value={Description}/>
              <br />
              <br />
              <label>가격($)</label>
              <Input type="number" onChange={priceChangeHandler} value={Price}/>
              <br />
              <br />
              <select onChange={continentChangeHandler} value={Continent}>

                  {Continents.map(item => (
                      <option key={item.key} value={item.key}>{item.value}</option>
                  ))}

              </select>
              <br />
              <br />
              <Button onClick={submitHandler}>
                  확인
              </Button>

            </Form>
        </div>

        
    )
}

export default UploadProductPage
