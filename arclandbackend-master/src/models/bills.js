const mongoose = require('mongoose')
// var moment = require('moment');
// var now = moment();

var billsSchema = new mongoose.Schema({

  
  band: {
    type: String,
    default: 0
  },
  material_price: {
    type: Number,
    trim: true,
  },
  bill: {
    type: Number,
    trim: true,
  },
   
 bills_id: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Location'
  }, 

  date: {
    type: Date,
        default: Date.now,
        index: true,
  },

})
 
billsSchema.pre('save', async function (next) {
  var  now=new Date()
  if (!this.date) {
         this.date=now  
       } 
 next()
})
const Bills = mongoose.model('Bills', billsSchema)
module.exports = Bills
