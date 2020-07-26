const express = require('express');
const router = express.Router();
const Location_detail = require('../models/location_detail')
const Bills = require('../models/bills')
const Location = require('../models/location')
const Admin = require('../models/admin')
const auth = require('../middleware/companyauth')
const adminAuth = require('../middleware/admin')
const authorize = require('../_helpers/adminauthorize')
var moment = require('moment');
const mongoose = require('mongoose')

router.post('/location_details', adminAuth, async (req, res) => {

    try {
        const location_details = new Location_detail({
            ...req.body,
            Location_detail_id: req.body.Location_detail_id,
        })
        await location_details.save().then(() => res.status(200).send(location_details))
    } catch (e) {
        return res.status(400).send(e)
    }
})
 


router.get('/location_details', adminAuth, async (req, res) => {
    try {
        const location_details = await Location_detail.find({}).sort('-date')
        //    this.location_details.expected_collection_date = moment(this.location_details.expected_collection_date).format('YYYY.M.D')
        res.send(location_details)
    } catch (e) {
        res.status(400).send()
    }
})

 

router.get('/location_details/:id', adminAuth, async (req, res) => {
    try {

        const _id = req.params.id

        const location = await Location.findById(_id)

        const location_details = await Location_detail.find({ Location_detail_id: _id })

        res.status(200).send(location_details)



    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})
 
router.patch('/location_details/:id', adminAuth, async (req, res) => {
    const updates = Object.keys({ ...req.body, id: req.body._id })
    const _id = req.params.id
    try {
        const location_details = await Location_detail.findById(_id)

        updates.forEach((update) => location_details[update] = req.body[update])
        await location_details.save()

        if (!location_details) {
            return res.status(404).send()
        }

        res.send(location_details)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})


router.delete('/location_details/:id', async (req, res) => {
    try {
        const location_details = await Location_detail.findByIdAndDelete(req.params.id)

        if (!location_details) {
            res.status(404).send()
        }

        res.send(location_details)
    } catch (e) {
        res.status(401).send()
    }
})

//اجمالى المصروفات = اجمالى الفواتير +اجمالى الصنايعى

router.get('/total_workers/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const location_details = await Location_detail.aggregate([
            {
                $match: { Location_detail_id: mongoose.Types.ObjectId(_id) }
            },
            {
                $group: {
                    _id: null,
                    "total_for_worker": { $sum: '$total_for_worker' },
                }
            },
            {
                $project: {
                    _id: 0,
                    "TotalAmountforworker": '$total_for_worker'
                }
            },])
        const bills = await Bills.aggregate([
            {
                $match: { bills_id: mongoose.Types.ObjectId(_id) }
            },
            {
                 $group: {
                    _id: null,
                    "bill": { $sum: '$bill' },
                }
            },
            {
                $project: {
                    _id: 0,
                    "TotalAmountforbills": '$bill'
                }
            },])
       res.status(200).send({ location_details, bills })
    } catch (e) {
        res.status(400).send(e)
        console.log(e)
    }
})

router.get('/total_workers', async (req, res) => {
     try {
         const location_details = await Location_detail.aggregate([
           
            {
                $group: {
                    _id: '$Location_detail_id',
                    "total_for_worker": { $sum: '$total_for_worker' },
                }
            },
            {
                $project: {
                    _id: 1,
                    "TotalAmountforworker": '$total_for_worker'
                }
            },])
        const bills = await Bills.aggregate([
             {
                 $group: {
                    _id: '$bills_id',
                    "bill": { $sum: '$bill' },
                }
            },
            {
                $project: {
                    _id: 1,
                    "TotalAmountforbills": '$bill'
                }
            },])
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
              }
              const locations = await Location.find({})

              const ids = [
                ...location_details.map((item) => item._id.toString()),
                ...bills.map((item) => item._id.toString()),
                ...locations.map((item) => item._id.toString()),
              ].filter(onlyUnique);
              const result = [];
              ids.forEach((id) => {
                let detail = location_details.find((item) => item._id.toString() === id);
                let bill = bills.find((item) => item._id.toString() === id);
                result.push({
                  _id: id,
                  value:
                    (detail ? detail.TotalAmountforworker : 0) +
                    (bill ? bill.TotalAmountforbills : 0),
                });
              });
              
        res.status(200).send( {result} )
    } catch (e) {
        res.status(400).send(e)
        console.log(e)
    }
})

router.patch('/worker_payment/:id',   async (req, res) => {
    try {
        const location_details = await Location_detail.findByIdAndUpdate({_id:req.params.id},{ $push : { worker_payments_for_now : {values:req.body.worker_payments_for_now}} }
            )
 
       await location_details.save()

      if (!location_details) {
          return res.status(404).send()
      }

      res.send(location_details)
  } catch (e) {
      res.status(400).send(e)
      console.log(e)
  }
    
})

router.get('/worker_payment_total', async (req, res) => {
    try {
             const location_details = await Location_detail.aggregate([
          
                {
                    $group: {
                        _id: '$_id',
                        "totalValue": {
                         $sum: {
                             $sum: "$worker_payments_for_now.values"
                         } 
                     }
                 }} ,
                 
            {
                $project: {
                    _id: 1,
                    "totalValue": '$totalValue'
                }             
                } 
                ])
                const location_detail = await Location_detail.find({})

            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
              }
                     const ids = [
                        ...location_details.map((item) => item._id.toString()),
                        ...location_detail.map((item) => item._id.toString()),
                         
              ].filter(onlyUnique);
              const result = [];
              ids.forEach((id) => {
                let detail = location_details.find((item) => item._id.toString() === id);
                let location_det = location_detail.find((item) => item._id.toString() === id);
                   result.push({
                  _id: id,
                  value:
                  (detail ? detail.totalValue : 0) ,
                  diffrence:(location_det ? location_det.total_for_worker : 0)-(detail ? detail.totalValue : 0)
                            
                });
              });
              
     
             
       res.status(200).send( {result} )
   } catch (e) {
       res.status(400).send(e)
       console.log(e)
   }
})



module.exports = router;