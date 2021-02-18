import React, {useState, useEffect} from 'react'
import ImageGallery from 'react-image-gallery'



function ProductImage(props) {

    const [Images, setImages] = useState([])

    useEffect(() => {
        if(props.detail.images && props.detail.images.length > 0){
            let images= []

            props.detail.images.map(item => {
                images.push({
                    original: `http://localhost:5000/${item}`,
                    thumbnail: `http://localhost:5000/${item}`
                })
            })
            setImages(images)
        }
    }, [props.detail]) 
    //[]안에 props.detail이 들어있어 props.detail이 바뀔 때마다
    //useEffect을 한 번 더 실행하라는 기능을 발휘한다.
    //props.detail은 특별하게 부모 컴포넌트에서 계속 이미지가 바뀌기 때문이다.


    
    return (
        <div>
            <ImageGallery items={Images}/>
        </div>
    )
}

export default ProductImage
