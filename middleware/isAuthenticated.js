
const { log } = require("console")
const jwt=require("jsonwebtoken")
const User = require("../model/userModel")
// const promisify=require("util").promisify

const isAuthenticated=(req,res,next)=>{
    const token=req.cookies.token
   
    if(!token || token==null){
        return res.send("Please Login")
    }
    jwt.verify(token,process.env.SECRET,async (err,result)=>{
        if(err){
            res.send("Invalid Token")
        }else{
           const data= await User.findById(result.userId)
           if(!data){
            res.send("Invalid user ID in the Token")
           }else{
            req.userId=result.userId
            next()
           }
        }
    })
}

module.exports=isAuthenticated