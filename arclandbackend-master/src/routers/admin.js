const express = require('express')
const Admin = require('../models/admin')
const passwordResetToken = require('../models/reset_token');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const adminAuth = require('../middleware/admin')
const adminauthorize = require('../_helpers/adminauthorize')
const Role = require('../_helpers/role');
const err = require('../_helpers/error-handler');
const secret = require('../../config.json');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const mongoose = require("mongoose");
var multer = require('multer');
const PATH = './public/images';

const router = new express.Router()


var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATH);
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
    cb(null, file.originalname);
  }
});
var upload = multer({ storage: storage });


router.post('/admin', async (req, res, next) => {
  const admin = new Admin({
    ...req.body

  })
  try {
    await admin.save()
    const token = await admin.generateAuthToken()
    res.status(200).send({ admin, token })
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/admin', adminAuth, async (req, res) => {
  try {
    const admin = await Admin.find({})
    res.status(200).send(admin)

  } catch (err) {
    res.status(401).send({ err: 'unable to register!' })
  }
})

router.post('/admin/login', async (req, res, next) => {
  try {
    const admin = await Admin.findByCredentials(req.body.email, req.body.password)
    if (!admin.status == 1) {
      return res
        .status(400)
        .json({ message: 'you are blocked' });
    } else {
      const token = await admin.generateAuthToken()
      res.send({ admin, token })
    }
  } catch (err) {
    res.status(400).json({ message: 'Username or password is incorrect' })
  }
})

router.post('/admin/logout', adminAuth, async (req, res) => {
  try {
    req.admin.tokens = req.admin.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.admin.save()

    res.status(200).send('user logout!')
  } catch (err) {
    res.status(400).send({ err: 'cannot logout!' })
  }
})

router.post('/admin/logoutAll', adminAuth, async (req, res) => {
  try {
    req.admin.tokens = []
    await req.admin.save()
    res.send('admin logoutall!')
  } catch (err) {
    res.status(4000).send({ err: 'cannot logoutall!' })
  }
})

router.get('/admin/me', adminAuth, async (req, res) => {
  res.send(req.admin)
})

router.patch('/admin/:id', async (req, res) => {
  //   let image = req.body.image;
  // if (req.file) {
  //    image =  req.file.filename;
  // }

  const updates = Object.keys(req.body)
  try {
    const admin = await Admin.findById({ _id: req.params.id })

    updates.forEach((update) => admin[update] = req.body[update])
    await admin.save()

    if (!admin) {
      return res.status(404).send()
    }

    res.send(admin)
  } catch (e) {
    console.log(e)

    res.status(400).send(e)
  }
})
// router.patch('/admins/update', upload.single('image'), adminAuth,async (req, res) => {
//     let image = req.body.image;
//   if (req.file) {
//      image =  req.file.filename;
//   }

//     const updates = Object.keys( req.body )
//     try {
//         const admin = await Admin.findOneAndUpdate({_id:req.body._id}, {image:image} )

//        updates.forEach((update) => admin[update] = req.body[update])
//        await admin.save()

//        if (!admin) {
//            return res.status(404).send()
//        }

//        res.send({admin})
//    } catch (e) {
// console.log(e)
//        res.status(400).send(e)
//    }
// })

router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id)
    if (!admin) {
      res.status(404).send()
    }

    res.send(admin)
  } catch (e) {
    res.status(401).send()
  }
})



//resetpassword routes

router.post('/req-reset-password', async (req, res) => {
  if (!req.body.email) {
    return res
      .status(500)
      .json({ message: 'Email is required' });
  }
  const admin = await Admin.findOne({
    email: req.body.email
  });
  if (!admin) {
    return res
      .status(409)
      .json({ message: 'Email does not exist' });
  }
  var resettoken = new passwordResetToken({ _adminId: admin._id, resettoken: crypto.randomBytes(16).toString('hex') });
  resettoken.save(function (err) {
    if (err) { return res.status(500).send({ msg: err.message }); }
    passwordResetToken.find({ _adminId: admin._id, resettoken: { $ne: resettoken.resettoken } }).remove().exec();
    res.status(200).json({ message: 'Reset Password successfully.' });
    var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,

      auth: {
        user: 'mahmoud.s.ghabour@gmail.com',
        pass: 'mahmoud'
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    var mailOptions = {
      to: admin.email,
      from: 'your email',
      subject: 'Arcland Password Reset',
      text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://localhost:4200/reset-password/' + resettoken.resettoken + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    }
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return console.log(err.message);
      }

    })
  })
})




router.post('/new-password', async (req, res) => {

  passwordResetToken.findOne({ resettoken: req.body.resettoken },
    function (err, userToken, next) {
      if (!userToken) {
        return res
          .status(409)
          .json({ message: 'Token has expired' });
      }

      Admin.findOne({
        _id: userToken._adminId,


      }, function (err, admin, next) {

        if (!admin) {
          return res
            .status(409)
            .json({ message: 'Admin does not exist' });
        }


        if (err) {
          return res
            .status(400)
            .json({ message: 'Error hashing password' });
        }
        admin.password = req.body.password;
        admin.save(function (err) {
          if (err) {
            return res
              .status(400)
              .json({ message: 'Password can not reset.' });
            console.log(err)
          } else {
            userToken.remove();
            return res
              .status(201)
              .json({ message: 'Password reset successfully' });

          }
        });
        console.log(admin.password)


      });
    });
})





router.post('/valid-password-token', async (req, res) => {
  if (!req.body.resettoken) {
    return res
      .status(500)
      .json({ message: 'Token is required' });
  }
  const userreset = await passwordResetToken.findOne({
    resettoken: req.body.resettoken
  });
  if (!userreset) {
    return res
      .status(409)
      .json({ message: 'Invalid URL' });
  }
  Admin.findOne({ _id: userreset._adminId }).then(() => {
    res.status(200).json({ message: 'Token verified successfully.' });
  }).catch((err) => {
    return res.status(500).send({ msg: err.message });
  });
})
















module.exports = router