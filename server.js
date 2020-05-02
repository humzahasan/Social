const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT ||5000;
const uri = process.env.ATLAS_URI;

app.use(express.json({extended : false}))

 

const connectDB = async () => {
    try {
        await mongoose.connect(uri , {
            useNewUrlParser: true,
            useCreateIndex : true,
            useFindAndModify : false,
            useUnifiedTopology : true
        })
        console.log("Connected to the Databse....")
    } catch (error) {
        console.log(error); 
        process.exit(1);
    }
}; 

connectDB();

const registerRouter = require('./routes/register')
const loginRouter = require('./routes/auth') 
const profileRouter = require('./routes/profile') 

app.use('/register',registerRouter)
app.use('/auth',loginRouter)
app.use('/profile',profileRouter)

app.listen(port , () => {
    console.log("Server running at port : "+port)
})