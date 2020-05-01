const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const {check , validationResult } =  require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.jwt
const Users = require('../models/users.model')

router.get('/', auth ,async (req,res) => {
    
    try {
        const user = await Users.findById(req.user.id).select('-password') 
        return res.json(user)

    } catch (error) {
        console.error(error)
        res.status(500).json('Server Error')
    }
})

router.post('/', [
    check('email','Please enter a valid email').isEmail(),
    check('password','Password is required').exists()
],async (req,res) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).send({errors : errors.array()})
    }

    const {email,password} = req.body;
    console.log(req.body)
    try {
        
        let user = await Users.findOne({email})

        if(!user) {
           return res.status(400).send({msg : "Invalid Credentials"}) 
        }

        const isMatch = await bcrypt.compare(password, user.password)

       if(!isMatch) {
        return res.status(400).send({msg : "Invalid Credentials"}) 
     }

        const payload = {
            user : {
                id : user.id
            }
        }

        jwt.sign(payload,secret, {expiresIn : 3600},
            (err,token) => {
                if(err) throw err;
                res.json({token})
            })

    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server error');
    }

})

module.exports = router;