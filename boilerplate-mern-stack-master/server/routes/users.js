const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require("../models/Product");
const { Payment } = require("../models/Payment")

const { auth } = require("../middleware/auth");
const async = require('async');

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});
                        //middleware
router.post("/addToCart", auth, (req, res) => {

   //먼저 User 콜렉션에 해당 유저의 정보 가져오기

   //req.user === user //middleware을 통과하여 토큰에서 얻어온 user의 id값 가져옴
   User.findOne({_id: req.user._id},
   (err, userInfo) => {

    //가져온 정보에서 카트에다 넣으려하는 상품이 이미 들어 있는지 확인
    let duplicate = false;
    userInfo.cart.forEach((item) => {
        if(item.id === req.body.productId){ //product와 user에 들가있는 cart id 값을 비교해서 확인
            duplicate = true;
        }
    })
        //상품이 이미 있을때
        if(duplicate) {
            User.findOneAndUpdate(
                {_id: req.user._id, "cart.id": req.body.productId},
                //$inc 올려준다, 더해준다는 의미이며
                //$.quantity을 통해 cart의 quantity을 1 올려준다는 의미이다.
                {$inc: {"cart.$.quantity": 1}},
                //업데이트된 정보를 받기 위해 new: true을 주었다.
                {new: true},
                (err, userInfo) => {
                    if(err) return res.status(400).json({ success: false, err })
                    res.status(200).send(userInfo.cart)
                }

            )
        }
         //상품이 이미 있지 않을때
        else {
            User.findOneAndUpdate(
                {_id: req.user._id},
                {
                    $push: {
                        cart: {
                            id: req.body.productId,
                            quantity: 1,
                            date: Date.now()
                        }
                    }
                },
                {new: true},
                (err, userInfo) => {
                    if(err) return res.status(400).json({ success: false, err })
                    res.status(200).send(userInfo.cart)
                }
            )
        }
   })

});


router.get('/removeFromCart', auth, (req, res) => {

        //먼저 cart 안에 내가 지우려고 한 상품을 지워주기
    User.findOneAndUpdate(
        {_id: req.user._id},
        {    //$push와 반대 개념이다. 끌어오는 것이니 없어버린다는 것이다.
            "$pull":
            {"cart": {"id": req.query.id}}
        },
        {new: true},
        (err, userInfo) => {
            let cart = userInfo.cart;
            let array = cart.map(item => {
                return item.id
            })

    //product collection에서 현재 남아있는 삼푸들의 정보를 가져오기


    //변수 array에 담겨있는 id 값들을 $in으로 productIds = ['123123124', '12312312'] 이런식으로 바꿔줌.
         Product.find({"_id": {$in: array }})
        .populate('writer')
        .exec((err, productInfo) => {
          return res.status(200).json({
            productInfo,//원하는 카트 삭제한 해당 product 콜렉션 값 가져옴(클라이언트에서 합쳐 다시 카트 페이지에 놓아주기 위한것임)
            cart //원하는 카트 삭제 후 업데이트 된 값이 담겨있는 cart
          })
       })
        }
    )        
})


router.post('/successBuy', auth, (req, res) => {

    //1. User.Collection 안에 History 필드 안에 간단한 결제 정보 넣어주기
    let history = [];
    let transactionData = {};

    req.body.cartDetail.forEach((item) => {
        history.push({
            dateOfPurchase: Date.now(),
            name: item.title,
            id: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId: req.body.paymentData.paymentID
        })
    })

    //2. Payment Collection 안에 자세한 결제 정보들 넣어주기
    transactionData.user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }

    transactionData.data = req.body.paymentData;
    transactionData.product = history

    User.findOneAndUpdate(
        {_id: req.user._id},        //아래 $set은 결제후 카트를 비우기 위함
        {$push: { history: history }, $set: {cart: [] }},
        { new: true }, //{ new: true }는 User 콜렉션에 새롭게 업데이트 된 것을 받는다는 의미
        (err, user) => {//업데이트 된 정보 두번째 인자 user에 들어감(새롭게 업데이트 된 user의 정보임)
            if(err) return res.json({ success: false. err });


            //payment에다가 transactionData 정보 저장
        const payment = new Payment(transactionData)
        payment.save((err, doc) => {
            if(err) return res.json({ success: false, err });


    //3. Product Collection 안에 있는 Sold 필드 정보 업데이트 시켜주기

            //상품 당 몇개의 quantity을 샀는지 알아야한다.
        let products = [];
        doc.product.forEach(item => {
            products.push({id: item.id, quantity: item.quantity})
        })

        //async라는 모듈을 사용하여 products의 정보들을 돌려준다.
        async.eachSeries(products, (item, callback) => {
            Product.findOneAndUpdate(
                {_id: item.id},
                {
                    $inc: {
                        "sold": item.quantity
                    }
                },
                { new: false}, //프론트에 굳이 보내주지 않아서 false로 함.
                callback
            )
        },(err) => {
            if(err) return res.json({ success: false, err})
            res.status(200).json({
                success: true,
                cart: user.cart, //몽고DB을 통해 업데이트 된 cart 정보임(결제 완료이기 때문에 cart도 비어있음)
                cartDetail: [] //구매 완료 후에는 cartDetail을 비워줘야 하기 때문에 빈 배열로 보내줌
                })
            })  
        })
      }
    )
})


router.get('/DeleteHistory',auth, (req, res) => {
   
        
        User.findOneAndUpdate(
            {_id: req.user._id},
            {    //$push와 반대 개념이다. 끌어오는 것이니 없어버린다는 것이다.
                $pull:
                {history: {id: req.query.id}}
            },
            {new: true},
            (err, historyInfo) => {
                if(err) return res.json({ success: false, err})
                res.status(200).json({ success: true, historyInfo})
            })

});



module.exports = router;
