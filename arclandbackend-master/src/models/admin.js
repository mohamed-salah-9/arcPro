const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
var multer  = require('multer');
const isImage = require('is-image');
const config = require('../../config.json');
const Role = require('../_helpers/role');


var adminSchema = new mongoose.Schema({

    role:{
    type:String,
    default:"Admin"
},

  fullname: {
    type: String,
    min: [5, 'Too short, min is 5 characters'],
    max: [50, 'Too long, max is 32 characters'],
     required: true,
    trim: true,
            },
    password: {
        type: String,
        min: [5, 'Too short, min is 5 characters'],
        max: [32, 'Too long, max is 32 characters'],
        required: 'Password is required',
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
             throw new Error('Password cannot contain "password"')
            } }
          },
    email: {
        type: String,
        min: [5, 'Too short, min is 5 characters'],
        max: [32, 'Too long, max is 32 characters'],
        unique: true,
        lowercase: true,
        required: 'Email is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]        
      } ,
    phone: {          
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isMobilePhone(value,'any')) {
                throw new Error('phone is invalid')
            }}
     },
     image:{
        type: String,
        validate(value) {
            if (!isImage(value)) {
                throw new Error('image is invalid')
            }}
            ,default:'arcland.jpg'
     },
     address:{
        type: String,
        trim: true,
        min:4,
        max:100
     },
     status:{
       type:Number,
       default:1
     },
     tokens: [{
         token: {
             type: String,
             required: true
         }
     }]
})
adminSchema.virtual('Location', {
    ref: 'Location',
    localField: '_id',
    foreignField: 'admin_id'
})
 
 
 

adminSchema.methods.toJSON = function () {
    const admin = this
    const adminObject = admin.toObject()

    delete adminObject.password
    delete adminObject.tokens

    return adminObject
}
 

adminSchema.methods.generateAuthToken = async function() {
    const admin =  this;
    if (admin) {
        const token = jwt.sign({_id:admin._id.toString()}, config.secret);
        admin.tokens = admin.tokens.concat({token})
     await admin.save()
        return token;
    }
}

adminSchema.statics.findByCredentials = async(email,password)=>{
    const admin = await Admin.findOne({email})
    
    if(!admin){
        throw new Error('admin not found')
    }
    const isMatch = await bcrypt.compare(password, admin.password)
    console.log(admin.password)
    console.log(isMatch)
    if(!isMatch) throw new Error('password error')
    return admin
}
 adminSchema.pre('save', async function (next) {
    const admin = this

    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 10)
    }

    next()
})

 
const Admin = mongoose.model('Admin', adminSchema)
 module.exports= Admin
