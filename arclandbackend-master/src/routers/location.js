const express = require('express');
const router = express.Router();
const Location = require('../models/location')
const Location_detail = require('../models/location_detail')
const Bussiness = require('../models/business')
const Admin = require('../models/admin')
const auth = require('../middleware/companyauth')
const adminAuth = require('../middleware/admin')
const authorize = require('../_helpers/adminauthorize')
const Bills = require('../models/bills')
const mongoose = require('mongoose')

var moment = require('moment');

router.post('/locations', adminAuth, async (req, res) => {

    try {
        const locations = new Location({
            ...req.body,
            admin_id: req.admin._id,     
        })
        await locations.save().then(() => res.status(200).send(locations))
    } catch (e) {
        return res.status(400).send(e)
    }
})
 

router.get('/locations', adminAuth, async (req, res) => {
    try {
        const locations = await Location.find({}).sort('-date')
         res.send(locations)
    } catch (e) {
        res.status(400).send()
    }
})
 

router.get('/locations/:id', adminAuth, async (req, res) => {
    const _id = req.params.id

    try {
        const locations = await Location.findById(_id)

        if (!locations) {
            return res.status(404).send()
        }

        res.send(locations)
    } catch (e) {
        res.status(500).send()
    }
})
router.get('/location_reports/:id',  async (req, res) => {
    const _id = req.params.id
 const business = await Bussiness.findById(_id)

const locations = await Location.find({bussines_id:business._id})
 try {
            
                res.status(200).send(locations )
             
        } catch (e) {
            console.log(e)
            res.status(400).send()
        }
    
})
 
router.patch('/locations/:id', adminAuth, async (req, res) => {
     const updates = Object.keys(req.body)
    try {
        const locations = await Location.findById(req.params.id)

       updates.forEach((update) => locations[update] = req.body[update])
       await locations.save()

       if (!locations) {
           return res.status(404).send()
       }

       res.send(locations)
   } catch (e) {
       res.status(400).send(e)
   }
     
})
router.patch('/payment/:id',   async (req, res) => {
    try {
        const locations = await Location.findByIdAndUpdate({_id:req.params.id},{ $push : { payment : req.body.payment} }
            )
 
       await locations.save()

      if (!locations) {
          return res.status(404).send()
      }

      res.send(locations)
  } catch (e) {
      res.status(400).send(e)
      console.log(e)
  }
    
})

router.delete('/locations/:id', async (req, res) => {
    try {
        const id=req.params.id 
        const locations = await Location.findByIdAndDelete(id)
        const location_detail = await  Location_detail.deleteMany({Location_detail_id:id})
        const bills = await  Bills.deleteMany({bills_id:id})

        if (!locations) {
            res.status(404).send()
        }
         res.status(200).send( {location_detail} )

     } catch (e) {
        res.status(401).send()
        console.log(e)
    }
})


router.get('/total_pay', async (req, res) => {
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
            const locations = await Location.aggregate([
          
                {
                    $group: {
                        _id: '$_id',
                        "totalValue": {
                         $sum: {
                             $sum: "$payment.values"
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
            
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
              }
            //   const location_details = [
            //     { _id: '5545488-4154848-548458', TotalAmountForworker: 4884.44 },
            //   ];
            //   const bills = [{ _id: '5545488-4154848-548458', TotalAmountForbill: 4847.44 }];
               const ids = [
                ...location_details.map((item) => item._id.toString()),
                ...bills.map((item) => item._id.toString()),
                ...locations.map((item) => item._id.toString()),
              ].filter(onlyUnique);
              const result = [];
              ids.forEach((id) => {
                let detail = location_details.find((item) => item._id.toString() === id);
                let bill = bills.find((item) => item._id.toString() === id);
                let location = locations.find((item) => item._id.toString() === id);
                result.push({
                  _id: id,
                  value:
                  (location ? location.totalValue : 0)-( (detail ? detail.TotalAmountforworker : 0) +
                    (bill ? bill.TotalAmountforbills : 0)),
                    total_pays:(location ? location.totalValue : 0),
                });
              });
              
     
             
       res.status(200).send( {result} )
   } catch (e) {
       res.status(400).send(e)
       console.log(e)
   }
})



router.get('/winning', async (req, res) => {
    try {
        const location_details = await Location_detail.aggregate([
           
            {
                $group: {
                    _id: '$Location_detail_id',
                    "the_total_cost_to_the_customer": { $sum: '$the_total_cost_to_the_customer' },
                    "total_for_worker": { $sum: '$total_for_worker' },
                }
            },
            {
                $project: {
                    _id: 1,
                    "diffrence_workes": {$subtract: ["$the_total_cost_to_the_customer","$total_for_worker"]}
                }
            },])
        const bills = await Bills.aggregate([
             {
                 $group: {
                    _id: '$bills_id',
                    "bill": { $sum: '$bill' },
                    "material_price":{$sum:'$material_price'}
                }
            },
            {
                $project: {
                    _id: 1,
                    "diffrence_bills": {$subtract:["$material_price","$bill"]}
                }
            },])
          
         
            const locations = await Location.find({})

            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
              }
                   const ids = [
                ...location_details.map((item) => item._id.toString()),
                ...bills.map((item) => item._id.toString()),
                ...locations.map((item) => item._id.toString()),
              ].filter(onlyUnique);
              const result = [];
              ids.forEach((id) => {
                let detail = location_details.find((item) => item._id.toString() === id);
                let bill = bills.find((item) => item._id.toString() === id);
                let location = locations.find((item) => item._id.toString() === id);
                result.push({
                  _id: id,
                  value:
                  (location ? location.fees_until_now : 0)+  (detail ? detail.diffrence_workes : 0) +
                    (bill ? bill.diffrence_bills : 0),
   
                     
                });
              });
              
     
             
       res.status(200).send( {result} )
   } catch (e) {
       res.status(400).send(e)
       console.log(e)
   }
})










router.get('/price_diffrenece', async (req, res) => {
    try {
        const location_details = await Location_detail.aggregate([
           
          
            {
                $project: {
                    _id: 1,
                    "diffrence_workes": {$subtract: ["$the_total_cost_to_the_customer","$total_for_worker"]},
                    "supervision_fees": {$subtract: ["$total_fees","$fees_until_now"]},
                //     "total_price_in_the_assey	": {$multiply: ["$estimated_amount_of_assay","$price_per_square_meter"]},
                //     "total_cost_to_customer": {$multiply: ["$actual_quantity","$price_per_square_meter"]},
                //     "total_for_worker": {$subtract: ["$the_total_cost_to_the_customer","$total_for_worker"]},
                //     "left_for_worker": {$subtract: ["$the_total_cost_to_the_customer","$total_for_worker"]},
                // }
             } }])
      
          
         
 
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
              }
                   const ids = [
                ...location_details.map((item) => item._id.toString()),
                
              ].filter(onlyUnique);
              const result = [];
              ids.forEach((id) => {
                let detail = location_details.find((item) => item._id.toString() === id);
                   result.push({
                  _id: id,
                  value:
               (detail ? detail.diffrence_workes : 0) 
                    
   
                     
                });
              });
              
     
             
       res.status(200).send( {result} )
   } catch (e) {
       res.status(400).send(e)
       console.log(e)
   }
})




router.get('/price_diffrenece', async (req, res) => {
    try {
        const location_details = await Location_detail.aggregate([
           
          
            {
                $project: {
                    _id: 1,
                    "diffrence_workes": {$subtract: ["$the_total_cost_to_the_customer","$total_for_worker"]},
                    "supervision_fees": {$subtract: ["$total_fees","$fees_until_now"]},
                //     "total_price_in_the_assey	": {$multiply: ["$estimated_amount_of_assay","$price_per_square_meter"]},
                //     "total_cost_to_customer": {$multiply: ["$actual_quantity","$price_per_square_meter"]},
                //     "total_for_worker": {$subtract: ["$the_total_cost_to_the_customer","$total_for_worker"]},
                //     "left_for_worker": {$subtract: ["$the_total_cost_to_the_customer","$total_for_worker"]},
                // }
             } }])
      
          
         
 
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
              }
                   const ids = [
                ...location_details.map((item) => item._id.toString()),
                
              ].filter(onlyUnique);
              const result = [];
              ids.forEach((id) => {
                let detail = location_details.find((item) => item._id.toString() === id);
                   result.push({
                  _id: id,
                  value:
               (detail ? detail.diffrence_workes : 0) 
                    
   
                     
                });
              });
              
     
             
       res.status(200).send( {result} )
   } catch (e) {
       res.status(400).send(e)
       console.log(e)
   }
})





router.get('/price_diffrenece', async (req, res) => {
    try {
        const location_details = await Location_detail.aggregate([
           
          
            {
                $project: {
                    _id: 1,
                    "diffrence_workes": {$subtract: ["$the_total_cost_to_the_customer","$total_for_worker"]},
                    "supervision_fees": {$subtract: ["$total_fees","$fees_until_now"]},
                //     "total_price_in_the_assey	": {$multiply: ["$estimated_amount_of_assay","$price_per_square_meter"]},
                //     "total_cost_to_customer": {$multiply: ["$actual_quantity","$price_per_square_meter"]},
                //     "total_for_worker": {$subtract: ["$the_total_cost_to_the_customer","$total_for_worker"]},
                //     "left_for_worker": {$subtract: ["$the_total_cost_to_the_customer","$total_for_worker"]},
                // }
             } }])
      
          
         
 
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
              }
                   const ids = [
                ...location_details.map((item) => item._id.toString()),
                
              ].filter(onlyUnique);
              const result = [];
              ids.forEach((id) => {
                let detail = location_details.find((item) => item._id.toString() === id);
                   result.push({
                  _id: id,
                  value:
               (detail ? detail.diffrence_workes : 0) 
                    
   
                     
                });
              });
              
     
             
       res.status(200).send( {result} )
   } catch (e) {
       res.status(400).send(e)
       console.log(e)
   }
})










router.get('/supervision_fees', async (req, res) => {
    try {
        const locations = await Location.aggregate([
           
          
            {
                $project: {
                    _id: 1,
                     "supervision_fees": {$subtract: ["$total_fees","$fees_until_now"]},
            
             } }])
      
          
         
 
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
              }
                   const ids = [
                ...locations.map((item) => item._id.toString()),
                
              ].filter(onlyUnique);
              const result = [];
              ids.forEach((id) => {
                let detail = locations.find((item) => item._id.toString() === id);
                   result.push({
                  _id: id,
                  value:
               (detail ? detail.supervision_fees : 0) 
                    
   
                     
                });
              });
              
     
             
       res.status(200).send( {result} )
   } catch (e) {
       res.status(400).send(e)
       console.log(e)
   }
})












//Chartjs analaysis
router.get('/charts', async (req, res) => {
    try {
        const location_details = await Location_detail.aggregate([
           
            {
                $group: {
                    _id: '$Location_detail_id',
                    "the_total_cost_to_the_customer": { $sum: '$the_total_cost_to_the_customer' },
                    "total_for_worker": { $sum: '$total_for_worker' },
                }
            },
            {
                $project: {
                    _id: 1,
                    "diffrence_workes": {$subtract: ["$the_total_cost_to_the_customer","$total_for_worker"]},
                    "TotalAmountforworker": '$total_for_worker'

                }
            },])
        const bills = await Bills.aggregate([
             {
                 $group: {
                    _id: '$bills_id',
                    "bill": { $sum: '$bill' },
                    "material_price":{$sum:'$material_price'}
                }
            },
            {
                $project: {
                    _id: 1,
                    "diffrence_bills": {$subtract:["$material_price","$bill"]}  ,                
                   "TotalAmountforbills": '$bill'
            }
            },])
            const locations2 = await Location.aggregate([
          
                {
                    $group: {
                        _id: '$_id',
                        "totalValue": {
                         $sum: {
                             $sum: "$payment.values"
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
            const locations = await Location.find({})

            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
              }
                   const ids = [
                ...location_details.map((item) => item._id.toString()),
                ...bills.map((item) => item._id.toString()),
                ...locations.map((item) => item._id.toString()),
                ...locations2.map((item) => item._id.toString()),
              ].filter(onlyUnique);
              const result = [];
              ids.forEach((id) => {
                let detail = location_details.find((item) => item._id.toString() === id);
                let bill = bills.find((item) => item._id.toString() === id);
                let location = locations.find((item) => item._id.toString() === id);
                let location2 = locations2.find((item) => item._id.toString() === id);
                result.push({
                  _id: id,
                  location: (location ? location.location:'no locations'),
                  expenses_value:
                  (detail ? detail.TotalAmountforworker : 0) +
                  (bill ? bill.TotalAmountforbills : 0),
                  winning_value:
                  (location ? location.fees_until_now : 0)+  (detail ? detail.diffrence_workes : 0) +
                    (bill ? bill.diffrence_bills : 0) ,


                 payment_value:(location2 ? location2.totalValue : 0),

                 
 
                     
                });
              });
              
     
             
       res.status(200).send( {result} )
   } catch (e) {
       res.status(400).send(e)
       console.log(e)
   }
})

module.exports = router;