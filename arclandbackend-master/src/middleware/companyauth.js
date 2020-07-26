const jwt = require('jsonwebtoken')
const Business = require('../models/business')
const secret = require('../../config.json');

const companyauth = async (req, res, next) => {

    try {
         
        const token = req.header('Authorization').replace('Bearer ','')
         
        const decoded = jwt.verify(token,secret.secret)
         
        const bussiness = 
        await Business.findOne({ _id: decoded._id, 'tokens.token': token })
        
        if (!bussiness)  throw new Error()  
        req.token = token
        req.bussiness = bussiness
            next()
    } catch (e) {
        res.send({error: 'unauthorized'})
    }
}

module.exports = companyauth