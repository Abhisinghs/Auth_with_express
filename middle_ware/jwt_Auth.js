const JWT=require('jsonwebtoken')

// define middle ware 
const jwtAuth=(req,res,next)=>{

    //take token from user 
    const token = (req.cookies && req.cookies.token) || null

    console.log(token);
    if(!token){
        return res.status(404).json({
            success:false,
            message:"User Unauthorised"
        })
    }

    try{
        const payload = JWT.verify(token,process.env.SECRET)
        req.user = {id:payload.id,email:payload.email}
    }catch(err){
        return res.status(400).json({
            success:false,
            message:err.message
        })
    }

    next()
}
//in middle ware we also pass the next and call next becuase if we do not do this so we trap in this block

module.exports = jwtAuth