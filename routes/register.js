const express = require('express');
const router = express.Router();
const {check , validationResult } =  require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Users = require('../models/users.model')

const secret = process.env.jwt

router.post('/', [
    check('name','Name is required').not().isEmpty(),
    check('email','Please enter a valid email').isEmail(),
    check('password','Please enter password with 6 or more character').isLength({min : 6})
],async (req,res) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).send({errors : errors.array()})
    }

    const {name,email,password} = req.body;
    console.log(req.body)
    try {
        
        let user = await Users.findOne({email})

        if(user) {
           return res.status(400).send({msg : "User already exist"}) 
        }
       
        user = new Users({
            name ,
            email, 
            password 
        })

        const salt = await bcrypt.genSalt(10); 
        user.password = await bcrypt.hash(password, salt);

        await user.save(); 

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