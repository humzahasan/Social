const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const saltRounds = 10;

router.get('/', (req,res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    let decrpt = bcrypt.compareSync(password, hash);

    const details = {
        username : username,
        password : hash,
        original : decrpt
    }
 
    res.send(details)
})


module.exports = router;