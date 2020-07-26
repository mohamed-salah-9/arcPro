const express = require('express');
const router = express.Router();
const Band = require('../models/bands')
const Location = require('../models/location')
const Admin = require('../models/admin')
const auth = require('../middleware/companyauth')
const adminAuth = require('../middleware/admin')
const authorize = require('../_helpers/adminauthorize')
var moment = require('moment');

router.post('/bands',  async (req, res) => {

    try {
        const bands = new Band({
            ...req.body,
            // bills_id:  req.body.bills_id,     
        })
        await bands.save().then(() => res.status(200).send(bands))
    } catch (e) {
        return res.status(400).send(e)
    }
})
 



router.get('/bands', async (req, res) => {
    try {
        const bands = await Band.find({})
         res.send(bands)
    } catch (e) {
        res.status(400).send()
    }
})

 
// router.get('/bands/:id', adminAuth, async (req, res) => {
//      try {
        
//         const _id = req.params.id

  
//         const bands = await Band.find({band_id:_id})
       
//             res.status(200).send( bands )
          

      
//     } catch (e) {
//         console.log(e)
//         res.status(400).send()
//     }
// })
 
router.patch('/bands/:id', adminAuth, async (req, res) => {
    const updates = Object.keys({...req.body,id:req.body._id})
    const _id = req.params.id
    try {
        const bands = await Band.findById(_id)

       updates.forEach((update) => bands[update] = req.body[update])
       await bands.save()

       if (!bands) {
           return res.status(404).send()
       }

       res.send(bands)
   } catch (e) {
       console.log(e)
       res.status(400).send(e)
   }
})


router.delete('/bands/:id', async (req, res) => {
    try {
        const bands = await Band.findByIdAndDelete(req.params.id)

        if (!bands) {
            res.status(404).send()
        }

        res.send(bands)
    } catch (e) {
        res.status(401).send()
    }
})


module.exports = router;