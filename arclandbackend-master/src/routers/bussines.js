const express = require('express')
const Bussiness = require('../models/business')
const companyauth = require('../middleware/companyauth')
const adminauth = require('../middleware/admin')
const passwordResetToken = require('../models/reset_token');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const router = new express.Router()

var multer = require('multer');
const PATH = './public/images';


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
        //   cb(null, 'image-' + Date.now() + '.' + filetype);
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage });

router.post('/bussiness', async (req, res, next) => {
    try {
        const business = new Bussiness(
            req.body
        )
        await business.save().then(() => res.status(200).send(business))
    } catch (e) {
        return res.status(400).send(e)
    }
})

router.get('/bussiness', adminauth, async (req, res) => {
    try {
        const bussiness = await Bussiness.find({}).sort('-date')
        res.status(200).send(bussiness)
    } catch (err) {
        res.status(401).send({ err: 'un authorized!' })
    }
})

router.get('/bussiness/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const bussiness = await Bussiness.findById(_id)

        if (!bussiness) {
            return res.status(404).send()
        }

        res.send(bussiness)
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/bussiness/login', async (req, res, next) => {
    try {
        const bussiness = await Bussiness.findByCredentials(req.body.email, req.body.password)
        if (bussiness.status == 1) {
            return res
                .status(400)
                .json({ message: 'Your Account Not ready yet' });
        } else if (bussiness.status == 3) {
            return res
                .status(400)
                .json({ message: 'Your are blocked' });
        }

        else {
            const token = await bussiness.generateAuthToken()
            res.send({ bussiness, token })
        }
    } catch (err) {
        res.status(400).json({ message: 'Username or password is incorrect' })

    }
})

router.post('/bussiness/logout', companyauth, async (req, res) => {
    try {
        req.bussiness.tokens = req.bussiness.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.bussiness.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/bussiness/logoutAll', companyauth, async (req, res) => {
    try {
        req.bussiness.tokens = []
        await req.bussiness.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/bussiness/me', companyauth, async (req, res) => {
    res.send(req.bussiness)
})

router.patch('/bussiness/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    // const allowedUpdates = ['points' ]
    // const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    // if (!isValidOperation) {
    //     return res.status(400).send({ error: 'Invalid updates!' })
    // }
    try {
        const bussiness = await Bussiness.findOneAndUpdate({ _id: req.params.id }, { status: 2 })

        updates.forEach((update) => bussiness[update] = req.body[update])
        await bussiness.save()

        if (!bussiness) {
            return res.status(404).send()
        }

        res.send(bussiness)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/bussiness/:id', adminauth, async (req, res) => {
    try {
        const bussiness = await Bussiness.findByIdAndDelete(req.params.id)
        if (!bussiness) {
            res.status(404).send()
        }

        res.send(bussiness)
    } catch (e) {
        res.status(401).send()
    }
})








module.exports = router