const mongoose = require('mongoose')
const validator = require('validator')
   
 

var bandSchema = new mongoose.Schema({
    
    name: {
        type: String,
              trim: true,
    },
    date: {
        type: Date,
        default: Date.now,
        index: true,
    }
    
})
 
 
  bandSchema.pre('save', async function (next) {
    var  now=new Date()
    if (!this.date) {
           this.date=now  
         } 
   next()
})
const Band= mongoose.model('Band', bandSchema)
module.exports = Band
