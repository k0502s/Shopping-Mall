const express = require('express');
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");

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
        if(item.id === req.body.productId){
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

module.exports = router;
