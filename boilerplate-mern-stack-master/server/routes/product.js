const express = require('express');
const router = express.Router();
var multer  = require('multer')
const {Product} = require('../models/Product')

//=================================
//             Product
//=================================

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`)
    }
  })
   
  var upload = multer({ storage: storage }).single("file")


router.post('/image', (req, res) => {


    //가져온 이미지를 저장을 해주면 된다.
    upload(req, res, err => {
        if(err){
            return req.json({success: false, err})
        }
        return res.json({success: true, filePath:res.req.file.path , fileName:res.req.file.filename})
    })


})


router.post('/', (req, res) => {
    //받아온 정보들을 DB에 넣어준다.
    const product = new Product(req.body)

    product.save((err) => {
        if(err) return res.status(400).json({success: false, err})
        return res.status(200).json({success: true})
    })

})


router.post('/products', (req, res) => {
   //product collection에 들어 있는 모든 상품 가져오기
                        //parseInt는 스트링을 숫자로 바꿔주는 메소드이다.
   let limit = req.body.limit ? parseInt(req.body.limit) : 100;
   let skip = req.body.skip ? parseInt(req.body.skip) : 0;
   let term = req.body.searchTerm;

   //받은 필터링된 데이터 filters를 for문을 이용하여 돌려주고 변수 findArgs에 담아주어 DB의 find 메소드 인자로 담아준다.
   let findArgs = {};
   for(let key in req.body.filters){
       if(req.body.filters[key].length > 0){ // 배열 안에 인덱스 값이 하나라도 무조건 존재해야 if문 실행된다.
        
        //키값이 price일 경우 발동 if문
        if(key === "price"){
            findArgs[key] = { // 만약 { price: [ 0, 199 ] } 이라면
            //$gte: 몽고DB 기능으로 크거나 같고를 뜻한다.
                $gte: req.body.filters[key][0], //인덱스 값이 [0]이므로 [0, 199] 중 0 가르킨다.
            //]$lte: 작거나 같고를 뜻한다.    
                $lte: req.body.filters[key][1]  //인덱스 값이 [1]이므로 [0, 199] 중 199을 가르킨다.
            }
           
        }else{
            findArgs[key] = req.body.filters[key];
        }

       }
   }

   console.log('findArgs', findArgs) // 예시: findArgs { continents: [ 1 ] } 혹은 { price: { '$gte': 0, '$lte': 199 } }
   
   if(term){
    Product.find(findArgs) //만약 인자로  continents: [ 1 ]을 받는다면 DB에서 continents가 1인 데이터를 찾아낸다. 아무것도 받지 못하면 모든 데이터 가져온다.
    .find({$text: { $search: term }}) //몽고DB을 이용하여 text 값을 통한 서치 기능을 구현
    .populate('writer')
    .skip(skip) //몽고DB에서의 메소드를 이용하여 skip과 limit 기능을 구현해줌
    .limit(limit)
    .exec((err, productInfo)=> {
        if(err) return res.status(400).json({success: false, err})
        return res.status(200).json({success: true, productInfo,
                                     postSize: productInfo.length
        })
     })
   } else {
    Product.find(findArgs) //만약 인자로  continents: [ 1 ]을 받는다면 DB에서 continents가 1인 데이터를 찾아낸다. 아무것도 받지 못하면 모든 데이터 가져온다.
    .populate('writer')
    .skip(skip) //몽고DB에서의 메소드를 이용하여 skip과 limit 기능을 구현해줌
    .limit(limit)
    .exec((err, productInfo)=> {
        if(err) return res.status(400).json({success: false, err})
        return res.status(200).json({success: true, productInfo,
                                     postSize: productInfo.length
        })
     })
   }
  

})



module.exports = router;
