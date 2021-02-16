import React, {useEffect, useState} from 'react'
import { FaCode } from "react-icons/fa";
import Axios from 'axios';
import {Icon, Col, Card, Row} from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Section/CheckBox';
import RadioBox from './Section/RadioBox';
import { continents, price } from './Section/Datas';


function LandingPage() {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)
    const [Filters, setFilters] = useState({ //여기에 체크박스 필터링한 인덱스 데이터 담아줌
        continents: [],
        price: []
    })


    useEffect(() => {

        let body = {
            skip: Skip,
            limit: Limit
        }

        getProducts(body)
      
    }, [])


    
    const getProducts = (body) => {
        Axios.post('/api/product/products', body)
        .then(response => {
            if(response.data.success){
                console.log(response.data)
                if(body.loadMore){ //더보기 버튼 누르면 발동 if문
                    //더보기 버튼을 누르면 원래 등장하던 product 뿐만 아니라
                    //숨겨져 있었던 나머지 product 또한 등장하게 하였다.
                    setProducts([...Products, ...response.data.productInfo])
                }else{
                    setProducts(response.data.productInfo)
                }
                setPostSize(response.data.postSize) //product 수에 따른 사이즈 값 state으로
            }else{
                alert('정보를 가져오는데 실패했습니다')
            }
        })
    }



    //더보기 버튼 클릭시 발동
    const loadMoreHandler = () => {
        let skip = Skip + Limit;
                 // 0   +   8
                 // 8   +   8
        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true,
            filters: Filters
        }

        getProducts(body)
        setSkip(skip)
    }







    //체크박스 필터 데이터 결과를 서버로 보내줌
    const showFilteredResults = (filters) => {

        let body = {
            skip: 0,
            limit: Limit,
            filters: filters //추가 
        }

        getProducts(body)
        setSkip(0) //서버로 작업 후 다시 skip을 0으로 초기화
    }


    const handlePrice = (value) => {
        const data = price;
        let array = [];

        for (let key in data){
            if(data[key]._id === parseInt(value, 10)){
                array = data[key].array;
            }
        }
        return array;
    }

    //체크박스 필터 데이터를 인자로 받아 여기서 처리
    const handleFilters = (filters, category) => {
        //일단 Filters state 현재 모든 데이터 변수화 
        const newFilters = {...Filters}

        //그리고 state 값인 Filters을 가지고 있는 newFilters는 Filters의 continents: []을 가지고 있는데
        // handleFilters의 두번째 인자로 받아온 category가 "continents"이기에  newFilters[category]는 즉
        // continents: []을 가리키는 것이며 이 가리키는 값을 filters로 선언하였다.
        newFilters[category] = filters //예시: continents: [체크박스를 통해 필터링 된 데이터 인덱스]

        //라디오 박스의 필터링 데이터를 받아올 경우
        if(category === "price"){
            let priceValues = handlePrice(filters)
            newFilters[category] = priceValues //priceValues가 예시: [0, 199] ,[200, 249]....
        }
        //마지막으로 결과 데이터를 서버로 전송하기 위해 아래와 같이 해줌
        showFilteredResults(newFilters)

        //Filters state 값에도 넣어주어 price와 continents 모두 같이 중복되게 필터링하게 해줌
        setFilters(newFilters)
    }








    //랜딩 페이지 이미지 카드 map 모듈화
    const renderCards = Products.map((product, index)=> {
        console.log('product', product)
        
        
    return <Col lg={8} md={8} xs={24} key={index}>
        <Card 
        cover={<ImageSlider images={product.images}/>}
        >
            <Meta 
            title={product.title}
            description={`${product.price}`}
            />
        </Card>
        </Col>
    })


    return (
       <div style={{width: '75%', margin: '3rem auto'}}>
           <div style={{textAlign: 'center', marginBottom:'3rem'}}>
               <h2>Let's Travel Anywhere <Icon type="rocket" /> </h2>
           </div>

           {/* Filter */}
            <Row gutter={[12, 12]}>
                <Col lg={12} xs={24}>
                     {/* CheckBox                       props을 통해 받은 인자 filters(newChecked)에서 체크박스를 통한 필터 데이터를 받아낸다. */}
                     <CheckBox list={continents} handleFilters={filters => handleFilters(filters, "continents")} />
                </Col>
                <Col lg={12} xs={24}>
                    {/* RadioBox */}
                    <RadioBox list={price} handleFilters={filters => handleFilters(filters, "price")} />
                </Col>
            </Row>
          
           

           {/* Search */}

           {/* Cards */}
           <Row gutter={[16,16]}>
           {renderCards}
           </Row>
           

           {/* PostSize가 Limit보다 많으면 더 볼 수 있는 product가 존재한다는 의미이므로 더보기 버튼을
           비교연산자를 통해 등장하게 하였다. 그 반대는 버튼을 사라지게 하였다. */}
           {PostSize >= Limit && 
           <div style={{display: 'flex', justifyContent: 'center', marginTop:'2rem'}}>
            <button onClick={loadMoreHandler}>더보기</button>
           </div>
           }

           
           
       </div>
    )
}

export default LandingPage
