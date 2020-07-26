const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
 
const config = require('../../config.json');


var bussinesSchema = new mongoose.Schema({
    status: {
        type: Number,
        default: 1
    } ,
    name: {
        type: String,
        min: [5, 'Too short, min is 5 characters'],
        max: [50, 'Too long, max is 32 characters'],
         required: true,
        trim: true,
    },
    phone: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isMobilePhone(value, 'any')) {
                throw new Error('phone is invalid')
            }
        }
    },
    email: {
        type: String,
        type: String,
        min: [5, 'Too short, min is 5 characters'],
        max: [32, 'Too long, max is 32 characters'],
        unique: true,
        lowercase: true,
        required: 'Email is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    address: {
        type: String,
        trim: true,
        min: 4,
        max: 100
    },
    date: {
        type: Date,
        default: Date.now ,
        index: true,
    }
    
})
bussinesSchema.virtual('Location',{
    ref:'Location',
    localField: '_id',
    foreignField: 'bussines_id'
  })
 
bussinesSchema.methods.toJSON = function () {
    const bussines= this
    const bussinesObject = bussines.toObject()

    delete bussinesObject.password
    delete bussinesObject.tokens

    return bussinesObject
}
// userschema.pre('remove',async function (next){
//     const user=this
//     await TextTrackList.deleteMany({user_question:user._id})
//     next()
// })
// 
bussinesSchema.methods.generateAuthToken = async function () {
    const bussines= this;
    if (bussines) {
        const token = jwt.sign({ _id: bussines._id.toString() }, config.secret);
        bussines.tokens = bussines.tokens.concat({ token })
        await bussines.save()
        return token;
    }
}
bussinesSchema.statics.findByCredentials = async (email, password) => {
    const bussines= await Bussines.findOne({ email })

    if (!bussines) {
        throw new Error('Bussines account not found')
    }
    const isMatch = await bcrypt.compare(password, bussines.password)
    console.log(bussines.password)
    console.log(isMatch)

    if (!isMatch) throw new Error('password error')
    return bussines
}
 bussinesSchema.pre('save', async function (next) {
    const bussiness= this

    if (bussiness.isModified('password')) {
        bussiness.password = await bcrypt.hash(bussiness.password,10)
    }

    next()
})
bussinesSchema.pre('save', async function (next) {
    var  now=new Date()
    if (!this.date) {
           this.date=now  
         }
   next()
})

const Bussines= mongoose.model('Bussines', bussinesSchema)
module.exports = Bussines
