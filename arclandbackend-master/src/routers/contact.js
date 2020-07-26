const express = require('express');
const router = express.Router();
const Conact = require('../models/contact')
const adminAuth = require('../middleware/admin')

router.post('/contact', async (req, res) => {

    try {
        const contact = new Conact({
            ...req.body,
        })

        await contact.save().then(() => res.status(200).send(contact))
    } catch (e) {
        console.log(e)
        return res.status(400).send(e)
    }
})




router.get('/contact', adminAuth, async (req, res) => {
    try {
        const contact = await Conact.find({}).sort('-createdAt')
        res.send(contact)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/contact/:id', adminAuth, async (req, res) => {
    try {
        const contact = await Conact.findByIdAndDelete(req.params.id)

        if (!contact) {
            res.status(404).send()
        }

        res.send(contact)
    } catch (e) {
        res.status(401).send()
    }
})


module.exports = router;