const mongoose = require('mongoose')



var SponsorSchema = new mongoose.Schema({
    image: {
        type: String
    }
}
    ,
    { timestamps: true })



const Sponsor = mongoose.model('Sponsor', SponsorSchema)
module.exports = Sponsor
