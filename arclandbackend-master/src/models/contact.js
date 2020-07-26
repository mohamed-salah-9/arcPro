const mongoose = require('mongoose')
// var moment = require('moment');
// var now = moment();
const validator = require('validator')


var ContactSchema = new mongoose.Schema({


    name: {
        type: String,
        required: true,

    },
    mobile: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isMobilePhone(value,'any')) {
                throw new Error('phone is invalid')
            }}

    }, 
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
       validate(value){
            if(!validator.isEmail(value)){
                throw new Error ('Email is invalid')
         }
        }
    }, 
    unit_type: {
        type: String,
        trim: true,

    },
    total_area: {
        type: Number,
        trim: true,
        required: true,

    },
    unit_locations: {
        type: String,
        trim: true,
        required: true,

    },
    best_time: {
        type: String,
        trim: true,
       required: true,

    }


},
    { timestamps: true })




const Contact = mongoose.model('Contact', ContactSchema)
module.exports = Contact
