const express = require('express');
const router = express.Router();
const Sponsor = require('../models/sponsors')
const adminAuth = require('../middleware/admin')
var multer = require('multer');
const PATH = './public/sponsors';

//upload sponsors
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, PATH)
    },
    filename: (req, file, cb) => {

        var filetype = '';
        if (file.mimetype === 'image/gif') {
            filetype = 'gif';
        }
        if (file.mimetype === 'image/png') {
            filetype = 'png';
        }
        if (file.mimetype === 'image/jpeg') {
            filetype = 'jpg';
        }
        cb(null, 'image-' + Date.now() + '.' + filetype);
        //   cb(null, file.originalname );
    }
});
var upload = multer({ storage: storage });



router.post('/sponsors', upload.single('image'), async (req, res) => {

    try {
        const sponsors = new Sponsor({
            ...req.body,

            image: "http://localhost:3000/" + req.file.filename,

        })

        await sponsors.save().then(() => res.status(200).send(sponsors))
    } catch (e) {
        console.log(e)
        return res.status(400).send(e)
    }
})




router.get('/sponsors', async (req, res) => {
    try {
        const sponsors = await Sponsor.find({}).sort('-createdAt')
        res.send(sponsors)
    } catch (e) {
        res.status(400).send()
    }
})







router.delete('/sponsors/:id', async (req, res) => {
    try {
        const sponsors = await Sponsor.findByIdAndDelete(req.params.id)

        if (!sponsors) {
            res.status(404).send()
        }

        res.send(sponsors)
    } catch (e) {
        res.status(401).send()
    }
})


module.exports = router;