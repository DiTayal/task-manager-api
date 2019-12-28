const jwt=require('jsonwebtoken');
const User=require('../models/user.js')

const auth=async(req,res,next)=>{
    //console.log("auth middleware");
    try{
        //const token=req.header("Authorization")
        //console.log(token);
        const token=req.header("Authorization").replace('Bearer ','');
        //console.log(token);
        const decoded=jwt.verify(token,process.env.JWT_SECRET);//checking whether token exist actually
        //get payload
        const user=await User.findOne({_id:decoded._id,'tokens.token':token})//property name in '' bcoz using special charatcer
        
        if(!user){
            throw new Error();
        }
        
        req.token=token;//for logout
        req.user=user;//user kahan se aaaya as property??????????????---we added property   
        next();
 

    }catch(e){
        res.status(401).send({error:'Please authenticate!'} )
    }
   // next();//route handler run only if next functoin called
}
module.exports=auth;