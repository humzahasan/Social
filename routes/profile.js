const express = require('express')
const router = express.Router()
const {check , validationResult } =  require('express-validator')
const auth = require('../middleware/auth')


const Profile = require('../models/profile.model')
const User = require('../models/users.model')

// GET profile/me
// Get Current User Profile Info

router.get('/me', auth, async (req, res) => {
    try {
      const profile = await Profile.findOne({
        user: req.user.id,
      }).populate('users', ['name', 'avatar']);
   
      if (!profile) {
        return res.status(400).json({ msg: 'There is no profile for this user' });
      }
   
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

//POST Create or Update User profile  '/' 



router.post('/me', [auth, [
    check('bio','Please enter a bio').not().isEmpty(),
    check('username','Please enter a username with minimum 6 character').isLength({min : 6})
    ]]  , async (req,res) => {
        const error = validationResult(req)

        if(!error.isEmpty()) {
            return res.status(400).send({error : error.array()})
        }

        
        const {
            username,
            age,
            status,
            bio,
            hobbies,
            facebook,
            instagram
        } = req.body

        let check = await Profile.findOne({username})
        if(check) {
            return res.status(400).send({msg : "Username already exist"}) 
         }

        const profileFields = {};

        profileFields.user = req.user.id;
        if(username) profileFields.username = username;
        if(age) profileFields.age = age;
        if(status) profileFields.status = status;
        if(bio) profileFields.bio = bio;
        if(hobbies) {
            profileFields.hobbies = hobbies.split(',').map(hobby => hobby.trim())
        }
        
        profileFields.social = {}
        if(facebook) profileFields.social.facebook = facebook;
        if(instagram) profileFields.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({user : req.user.id})

            if(profile) {
                profile = await Profile.findOneAndUpdate(
                    {user : req.user.id},
                    {$set : profileFields},
                    {new : true}
                )

                return res.json(profile)
            }


            profile = new Profile(profileFields)

            await profile.save()

            res.json(profile)

        } catch (error) {
            console.error(error)
            res.status(500).send('Server Error')
        }

})

router.put('/me', [auth, [
    check('bio','Please enter a bio').not().isEmpty(),
    check('username','Please enter a username with minimum 6 character').isLength({min : 6})
    ]]  , async (req,res) => {
        const error = validationResult(req)

        if(!error.isEmpty()) {
            return res.status(400).send({error : error.array()})
        }

        
        const {
            username,
            age,
            status,
            bio,
            hobbies,
            facebook,
            instagram
        } = req.body

        // let check = await Profile.findOne({username})
        // if(check) {
        //     return res.status(400).send({msg : "Username already exist"}) 
        //  }

        const profileFields = {};

        profileFields.user = req.user.id;
        if(username) profileFields.username = username;
        if(age) profileFields.age = age;
        if(status) profileFields.status = status;
        if(bio) profileFields.bio = bio;
        if(hobbies) {
            profileFields.hobbies = hobbies.split(',').map(hobby => hobby.trim())
        }
        
        profileFields.social = {}
        if(facebook) profileFields.social.facebook = facebook;
        if(instagram) profileFields.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({user : req.user.id})

            if(profile) {
                profile = await Profile.findOneAndUpdate(
                    {user : req.user.id},
                    {$set : profileFields},
                    {new : true}
                )

                return res.json(profile)
            }


            profile = new Profile(profileFields)

            await profile.save()

            res.json(profile)

        } catch (error) {
            console.error(error)
            res.status(500).send('Server Error')
        }

})

router.get('/all', async (req, res) => {
    try {
      const profiles = await Profile.find().populate('user', ['name', 'avatar']);
      res.json(profiles);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });


router.get('/user/:username', async (req, res) => {
    try {
      const profile = await Profile.findOne({
        username: req.params.username
      }).populate('user', ['name', 'avatar']);
   
      if (!profile) return res.status(400).json({ msg: 'Profile not found' });
   
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(400).json({ msg: 'Profile not found' });
    }
  });

module.exports = router;