const express = require('express');
const router = express.Router();
const Detail = require('../models/website_detail')

const adminAuth = require('../middleware/admin')

router.post('/details', adminAuth, async (req, res) => {

    try {
        const details = new Detail({
            ...req.body,
        })
        await details.save().then(() => res.status(200).send(details))
    } catch (e) {
        return res.status(400).send(e)
    }
})




router.get('/details', async (req, res) => {
    try {
        const details = await Detail.find({}).sort('-createdAt')
        res.send(details)
    } catch (e) {
        res.status(400).send()
    }
})


router.patch('/details/:id', adminAuth, async (req, res) => {
    const updates = Object.keys({ ...req.body })
    const _id = req.params.id
    try {
        const details = await Detail.findById(_id)

        updates.forEach((update) => details[update] = req.body[update])
        await details.save()

        if (!details) {
            return res.status(404).send()
        }

        res.send(details)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})


router.delete('/details/:id', adminAuth, async (req, res) => {
    try {
        const details = await Detail.findByIdAndDelete(req.params.id)

        if (!details) {
            res.status(404).send()
        }

        res.send(details)
    } catch (e) {
        res.status(401).send()
    }
})


module.exports = router;