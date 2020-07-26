const express = require('express');
const router = express.Router();
const Bills = require('../models/bills')
const Location = require('../models/location')
const Admin = require('../models/admin')
const auth = require('../middleware/companyauth')
const adminAuth = require('../middleware/admin')
const authorize = require('../_helpers/adminauthorize')
var moment = require('moment');

router.post('/bills', adminAuth, async (req, res) => {

    try {
        const bills = new Bills({
            ...req.body,
            bills_id:  req.body.bills_id,     
        })
        await bills.save().then(() => res.status(200).send(bills))
    } catch (e) {
        return res.status(400).send(e)
    }
})
// router.post('/requestsbyadmin',adminAuth,async(req,res)=>{  
//     const location_details = new Location_detail(req.body)

//    try {
//        await location_details.save().then(()=>res.status(200).send(location_details))

//    } catch (e) {
//        return res.status(400).send(e)
//      }

// //       const location_details= new Location_detail(req.body)
// //       location_details.save().then(()=>res.status(200).send(location_details))
// //   .catch((error)=>res.status(400).send(error))
// })



router.get('/bills', adminAuth, async (req, res) => {
    try {
        const bills = await Bills.find({}).sort('-date')
        //    this.location_details.expected_collection_date = moment(this.location_details.expected_collection_date).format('YYYY.M.D')
        res.send(bills)
    } catch (e) {
        res.status(400).send()
    }
})

// router.get('/userrequest',auth,async(req,res)=>{
//     const location_details = await Location_detail.find( {bussines_id:req.bussiness._id})
//     const business = await Bussiness.find({_id:req.bussiness._id})
//     try {
//         if(location_details.bussines_id==business._id ){
//             res.status(200).send(location_details )
//         }
//     } catch (e) {
//         res.status(400).send()
//     }
//  })

router.get('/bills/:id', adminAuth, async (req, res) => {
     try {
        
        const _id = req.params.id

         const location = await Location.findById(_id)
 
        const bills = await Bills.find({bills_id:_id})
       
            res.status(200).send( bills )
          

      
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})
// router.get('/user_requests/:id',auth,async(req,res)=>{
//     const _id = req.params.id
//  res.send(req.body)
//     try {
//         const location_details = await Location_detail.findById(_id)
//         if (!location_details) {
//             return res.status(404).send()
//         }
//         res.send(location_details)
//     } catch (e) {
//         res.status(500).send()
//     }
//  })
router.patch('/bills/:id', adminAuth, async (req, res) => {
    const updates = Object.keys({...req.body,id:req.body._id})
    const _id = req.params.id
    try {
        const bills = await Bills.findById(_id)

       updates.forEach((update) => bills[update] = req.body[update])
       await bills.save()

       if (!bills) {
           return res.status(404).send()
       }

       res.send(bills)
   } catch (e) {
       console.log(e)
       res.status(400).send(e)
   }
})


router.delete('/bills/:id', async (req, res) => {
    try {
        const bills = await Bills.findByIdAndDelete(req.params.id)

        if (!bills) {
            res.status(404).send()
        }

        res.send(bills)
    } catch (e) {
        res.status(401).send()
    }
})



router.get('/company_diffrenece', async (req, res) => {
    try {
        const bills = await Bills.aggregate([
           
          
            {
                $project: {
                    _id: 1,
                     "company_diff": {$subtract: ["$material_price","$bill"]},
            
             } }])
      
          
         
 
            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
              }
                   const ids = [
                ...bills.map((item) => item._id.toString()),
                
              ].filter(onlyUnique);
              const result = [];
              ids.forEach((id) => {
                let detail = bills.find((item) => item._id.toString() === id);
                   result.push({
                  _id: id,
                  value:
               (detail ? detail.company_diff : 0) 
                    
   
                     
                });
              });
              
     
             
       res.status(200).send( {result} )
   } catch (e) {
       res.status(400).send(e)
       console.log(e)
   }
})


module.exports = router;