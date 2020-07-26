const mongoose = require('mongoose')
// var moment = require('moment');
// var now = moment();

var locationSchema = new mongoose.Schema({

  location: {
    type: String,
    trim: true,
  },
  
  degree_of_progress: {
    type: String,
    trim: true,
  },
  completion_rate: {
    type: Number,
    trim: true,
  },
  payment: {
    type: Array
   },

  total_actual_expenses: {
    type: Number,
    trim: true,
  },
  required_payment: {
    type: Number,
    trim: true,
  },
  total_fees: {
    type: Number,
    trim: true,
  },
  fees_until_now: {
    type: Number,
    trim: true,
  },
  supervision_fees_required: {
    type: Number,
    trim: true,
  },
  admin_id: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Admin'
  },

  date: {
    type: Date,
    default: Date.now ,
    index: true,
  },
  bussines_id: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Bussines'
  },
})
locationSchema.virtual('Location_detail', {
  ref: 'Location_detail',
  localField: '_id',
  foreignField: 'Location_detail_id'
})
locationSchema.virtual('Bills', {
  ref: 'Bills',
  localField: '_id',
  foreignField: 'bills_id'
})
locationSchema.pre('save', async function (next) {
  var  now=new Date()
  if (!this.date) {
         this.date=now  
       }
 next()
})


const Location = mongoose.model('Location', locationSchema)
module.exports = Location
