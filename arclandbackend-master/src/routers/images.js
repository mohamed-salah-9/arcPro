const express = require('express');
const router = express.Router();
const Image = require('../models/images')
const adminAuth = require('../middleware/admin')
var multer = require('multer');
const PATH = './public/images';

//upload images
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
var upload = multer({ storage: storage }, { limits: { fieldSize: 2 * 1024 * 1024 } });



router.post('/images', upload.array('files'), async (req, res) => {

    try {
        const images = new Image({
            ...req.body,

            images: req.files.map(file => "http://localhost:3000/" + file.filename),

        })

        await images.save().then(() => res.status(200).send(images))
    } catch (e) {
        console.log(e)
        return res.status(400).send(e)
    }
})




router.get('/images', async (req, res) => {
    try {
        const images = await Image.find({}).sort('-createdAt')
        res.send(images)
    } catch (e) {
        res.status(400).send()
    }
})


router.get('/images/:id', async (req, res) => {
    try {

        const _id = req.params.id


        const images = await Image.findById(_id)

        res.status(200).send(images)



    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})

router.patch('/image/:id', upload.array('files'), async (req, res) => {

    const updates = Object.keys({
        ...req.body,

    })

    try {
        const _id = req.params.id

        //    const users = await User.findOneAndUpdate({_id:req.params.id}, {image:"http://209.97.178.62/"+image})
        const images = await Image.findOneAndUpdate({ _id: req.params.id }, { images: req.files.map(file => "http://209.97.178.62/" + file.filename) })

        updates.forEach((update) => images[update] = req.body[update])
        await images.save()

        if (!images) {
            return res.status(404).send()
        }

        res.send(images)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.patch('/images/:id', async (req, res) => {
    const updates = Object.keys({ ...req.body })
    const _id = req.params.id
    try {
        const images = await Image.findById(_id)

        updates.forEach((update) => images[update] = req.body[update])
        await images.save()

        if (!images) {
            return res.status(404).send()
        }

        res.send(images)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})


router.delete('/images/:id', async (req, res) => {
    try {
        const images = await Image.findByIdAndDelete(req.params.id)

        if (!images) {
            res.status(404).send()
        }

        res.send(images)
    } catch (e) {
        res.status(401).send()
    }
})


module.exports = router;