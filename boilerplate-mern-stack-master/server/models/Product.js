const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        default: 0
    },
    images: {
        type: Array,
        default: []
    },
    continents: {
        type: Number,
        default: 1
    },
    sold: {
        type: Number,
        maxlength: 100,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

//서치 기능을 위해 DB모델에서 따로 설정
productSchema.index({
    title:'text',
    description:'text'
},{
    weights:{
        title: 5, //title 값이 더 크다는 의미는 검색시 타이틀을 더 우선시 한다는 의미.
        description: 1
    }
})

const Product = mongoose.model('Product', productSchema);

module.exports = { Product }