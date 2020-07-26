const mongoose = require('mongoose')


var detailSchema = new mongoose.Schema({


    phone1: {
        type: String,

    },
    phone2: {
        type: String,

    },
    email1: {
        type: String,

    },
    email2: {
        type: String,

    },
    address: {
        type: String,
        trim: true,
    }

    ,
}, { timestamps: true })


const Detail = mongoose.model('Detail', detailSchema)
module.exports = Detail
