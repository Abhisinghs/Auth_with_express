//import express module 
const express = require('express')
require('dotenv').config()
const { sign } = require('jsonwebtoken')
const {signUp,signIn,getUser,userlogout}  = require('../controllers/user.controller')
const jwtAuth= require('../middle_ware/jwt_Auth')
const cookieParser=require('cookie-parser')
const cors=require('cors')

//create instance of express 
const routes=express.Router()

//middle ware
routes.use(express.json())
routes.use(cookieParser())
routes.use(cors({
    credentials:true  //for credential we use cookie to store and delete 
}))



//route for signup 
routes.post('/signup',signUp)

//route for signin
routes.post('/signin',signIn)

//routes for get user
routes.get('/user',jwtAuth,getUser)  //first we will go through the jwtAuth and then go to next is getUser

//routes for logout user 
routes.get('/logout',jwtAuth,userlogout)

module.exports = {
    routes
}