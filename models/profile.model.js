const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const ProfileSchema = new Schema ({
    user    : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
    },
    username : {
        type : String,
        required : true,
        unique : true
    },
    age : {
        type : Number
    },
    status : {
        type : String
    },
    bio : {
        type : String,
        required : true
    },
    hobbies : {
        type : [String]
    },
    social : {
        facebook : {
            type : String
        },
        instagram : {
            type : String
        }
    }
})

const Profile = mongoose.model('Profile', ProfileSchema)

module.exports = Profile;