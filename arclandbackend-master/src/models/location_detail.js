const mongoose = require('mongoose')


var location_detail_Schema = new mongoose.Schema({
    band_name:{
        type:String,
        trim: true,

    },

    estimated_amount_of_assay: {
        type: Number,
        trim: true,
    },
    price_per_square_meter: {
        type: Number,
        trim: true,
    },
    total_price_in_the_assay: {
        type: Number,
        trim: true,
    },
    actual_quantity: {
        type: Number,
        trim: true,
    },
    the_total_cost_to_the_customer: {
        type: Number,
        trim: true,
    },
    actual_total_paid_for_the_item_from_the_customer: {
        type: Number,
        trim: true,
    },
    price_per_square_meter_for_the_worker: {
        type: Number,
        trim: true,
    },
    total_for_worker: {
        type: Number,
        trim: true,
    },
    worker_payments_for_now: {
        type: Array
    },
    left_for_worker: {
        type: Number,
        trim: true,
    },
    the_price_difference: {
        type: Number,
        trim: true,
    },
    required_from_the_customer: {
        type: Number,
        trim: true,
    },
    date: {
        type: Date,
        default: Date.now,
        trim: true,
    },
    Location_detail_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Location'
      },
       
  
})
// location_detail_Schema.virtual('Location', {
//     ref: 'Location',
//     localField: '_id',
//     foreignField: 'reedemtion_id'
//   })

location_detail_Schema.pre('save', async function (next) {
    var  now=new Date()
    if (!this.date) {
           this.date=now  
         }
   next()
})

const Location_detail  = mongoose.model('Location_detail ', location_detail_Schema)
module.exports = Location_detail 
