const express = require('express');
const router = express.Router();
const Video = require('../models/videos')
const adminAuth = require('../middleware/admin')
var multer = require('multer');
const PATH = './public/videos';

//upload videos
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, PATH)
    },
    filename: (req, file, cb) => {

        var filetype = '';
        if (file.mimetype === 'video/mp4') {
            filetype = 'mp4';
        }
        if (file.mimetype === 'video/mkv') {
            filetype = 'mkv';
        }

        cb(null, 'video-' + Date.now() + '.' + filetype);
        //   cb(null, file.originalname );
    }
});
var upload = multer({ storage: storage });



router.post('/videos', upload.single('video'), async (req, res) => {

    try {
        const videos = new Video({
            ...req.body,

            video: req.file.filename,

        })

        await videos.save().then(() => res.status(200).send(videos))
    } catch (e) {
        console.log(e)
        return res.status(400).send(e)
    }
})




router.get('/videos', async (req, res) => {
    try {
        const videos = await Video.find({}).sort('-createdAt')
        res.send(videos)
    } catch (e) {
        res.status(400).send()
    }
})







router.delete('/videos/:id', async (req, res) => {
    try {
        const videos = await Video.findByIdAndDelete(req.params.id)

        if (!videos) {
            res.status(404).send()
        }

        res.send(videos)
    } catch (e) {
        res.status(401).send()
    }
})


module.exports = router;