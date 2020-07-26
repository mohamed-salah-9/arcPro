const mongoose = require('mongoose')



var videoSchema = new mongoose.Schema({
    video: {
        type: String
    },

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



const Video = mongoose.model('Video', videoSchema)
module.exports = Video
