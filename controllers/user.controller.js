//define the logic through function 

//bring the userModel here to levrage with data 
const emailValidator= require('email-validator')  //emailvalidator module for email validation
const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')



//define the signUp logic 
const signUp = async(req,res)=>{
    const {name,email,password,confirmPassword} =req.body

    //first check all field have data or not 
    if(!name|| !email|| !password || !confirmPassword){
        return res.status(404).json({
            success:false,
            message:'every Field is required'
        })
    }

    //check email is valid or not 
    const validEmail = emailValidator.validate(email)
    if(!validEmail){
        return res.status(404).json({
            success:false,
            message:'Please enter a valid email'
        })
    }

    //check password and confirm password is same or not 
    if(password !== confirmPassword){
        return res.status(404).json({
            success:false,
            message:'Password and confirm Password does not match '
        })
    }

    try{
        const result = await userModel.create(req.body)
        return res.status(200).json({
            success:true,
            data:result
        })

    }catch(err){
        if(err.code ===11000){   //mongoose provide bydefault feature to check user already exist or not 
            return res.status(500).json({
                success:false,
                message:`account already registered `
            })
        }else{
            return res.status(500).json({
                success:false,
                message:`${err.message}`
            })
        }
    }
}


//difine the signIn logic 
const signIn = async(req,res,next)=>{
    const {email,password}=req.body

    //check field is non empty 
    if(!email || !password){
        return res.status(404).json({
            success:false,
            message:'every field is required'
        })
    }

    try{
         //check user exist or not
        const user = await userModel.findOne({email}).select('+password')  //we need only password so we write select(+password)

        //now check password is match or not 
        if(!user || ! await (bcrypt.compare(password,user.password))){
            return res.status(404).json({
                success:false,
                message:'Invalid credentials'
            })
        }

        //generate jwt token
        const token = user.jwtToken()
        user.password = undefined //we dont want to send password to client 

        //set the cookie
        const cookieOption ={
            maxAge:24*60*60*1000, //cookie set for only 24hours 
            httpOnly:true,     //client cannot access 
        }

        res.cookie('token',token,cookieOption)
        res.status(200).json({
            success:true,
            data: user
        })
    }catch(err){
        return res.status(404).json({
            success:false,
            message:err.message
        })
    }
    next()
}

//get user function 
const getUser = async(req,res)=>{
    //take user id 
    const userId=req.user.id

    try{
        const user =await userModel.findById(userId)
        return res.status(200).json({
            success:true,
            data:user
        })

    }catch(err){
        return res.status(404).json({
            success:false,
            message:err.message
        })
    }

}

//define the logic of user logout 
const userlogout= async(req,res)=>{
    try{
        const cookieOption ={
            expires:new Date(),
            httpOnly:true
        }

        res.cookie('token',null,cookieOption)
        res.status(200).json({
            success:true,
            message:'user logout successfully'
        })
    }catch(e){
       return  res.status(400).json({
            success:false,
            message:e.message
        })
    }
}

module.exports = {
    signUp,
    signIn,
    getUser,
    userlogout
}