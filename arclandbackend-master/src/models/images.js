const mongoose = require('mongoose')



var imageSchema = new mongoose.Schema({
    images: [Object],

    title: {
        type: String,
        trim: true,
    }
    , description: {
        type: String,
        trim: true,
    },
}
    ,
    { timestamps: true })



const Image = mongoose.model('Image', imageSchema)
module.exports = Image
