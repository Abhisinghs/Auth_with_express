//configure the dotenv file
require('dotenv').config()

//import express module 
const express=require('express')
const { routes } = require('./routes/user.route')
const connectToDb = require('./config/dbConfig')


//connect to databse 
connectToDb()

//make instace of express
const app = express()

//Define port 
const PORT = process.env.PORT || 8000


//when user request to api/auth then go to routes 
app.use('/api/auth',routes)


app.get('/',(req,res)=>{
    res.status(200).json(`Hello world!`)
})


app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`);
})