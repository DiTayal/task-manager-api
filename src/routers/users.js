const express=require('express')

const User=require('../models/user.js');
const auth=require('../middleware/auth.js')
const multer=require('multer')
const sharp=require('sharp')
const {sendWelcomeEmail,sendCancelEmail}=require('../emails/account')//we r receiving object...so use object destructuring....

const router=new express.Router();//why?????????????????????????


router.post('/users',async(req,res)=>{//this function returns promise-----async wait
    const user=new User(req.body);//to save data...create a model

    try{
        await user.save();
        sendWelcomeEmail(user.email,user.name);
        const  token=await user.generateAuthToken();//generate toke, when save user and when login
        //res.status(201).send(user);
        res.status(201).send({user,token});
    }catch(e){
res.status(400).send(e);
    }
})


router.post('/users/login',async(req,res)=>{ //no authentication reqd

    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken();//we want to genertae token for very individual user...so use user
       // res.send(user)
       //res.send({user,token})//sending in response token also
       //data hiding
       //res.send({user:user.getPublicProfile(),token});//define getPublicProfile() in model----but need to change all route handlers....to avoid it...make a small change in funciton
       res.send({user,token});
        
    }catch(e){
        res.status(400).send(e);
    }

})

router.post('/users/logout',auth,async(req,res)=>{

    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!=req.token;
        })
        await req.user.save();
        res.send({msg:'SUccessfully logged out'});
    }catch(e){
        res.status(500).send(e)
    }
})


router.post('/users/logoutAll',auth,async(req,res)=>{//in postman choose right type of http request
    try{
        //req.user.tokens='';
        req.user.tokens=[];//empty array
        await req.user.save();
        res.send({msg:'Logged out successfully from all devices'});

    }catch(e){
        res.status(500).send(e);
    }
})



//see monoose drivers------------->  mongoosejs--------->docs--------->queries on models dirct
//use of mongoose over mongodb----create models and structure data in nicer way....also convert string id to object id automattically---like in find function......
            

router.get('/users/me',auth,async (req,res)=>{ 
    res.send(req.user);

})

//router.patch('/users/:id',async(req,res)=>{
    router.patch('/users/me',auth,async(req,res)=>{
    const updates=Object.keys(req.body);//to convert an object into array of its properties
    const allowedUpdates=['name','password','age','email'];
    //every single property must be in allowed updates

    //return true only if for all update it returns true
    const isValidOperation=updates.every((update)=>{
        return allowedUpdates.includes(update);
    })//can shortcut it syntax
    if(!isValidOperation){
       // return res.status(400).send("Error:Invalid updates");
       return res.status(400).send({error:'    //every single property must be in allowed updatesinvalid updates!'})//sending object
    }
    //if we have only the below code then if we update non existing property get 200 status--wrong----so use upper code
    try{
        //const user=User.findByIdAndUpdate(req.params.id,{name:'Anjana'},{new:true,runValidators:true})--static update
        //we have options---new---return new updated user and runvalidators means to run the validators on new data
        //findByIdAndUpdate method bypases the advanced middleware functions,also due to since it bypasses mongoose, needed to provide options----so to use them need to find alternaative to this method....
        /*
        const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        */
        //********************************await must else get empty array as returned*******************************
        //const user=await User.findById(req.params.id);
        const user=req.user;
        //update properties changed
        updates.forEach((update)=>{
            user[update]=req.body[update]
            //cant us edot notation, bcoz then will have to explicitly tell the property  
        })
        await user.save();//bcoz abhi values sirf change ki hai, par not saved
        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }    
})


//router.delete('/users/:id',async(req,res)=>{
router.delete('/users/me',auth,async(req,res)=>{
    try{
       // const user=await User.findByIdAndDelete(req.params.id);//no params as uing /me and not /id
    //    const user=await User.findByIdAndDelete(req.user._id);
    //     if(!user){
    //         return res.status(404).send();
    //     }

        await req.user.remove();
        sendCancelEmail(req.user.email,req.user.name);
        //to remove the tasks of user , we can write code here.......but we will us e middleware,
        // as we may have  many ways to delete a user apart form this function
        res.send(req.user);
    }catch(e){
    res.status(500).send(e);
    }

})


const upload=multer({
    //dest:'avatar',//---dont save in folder,so that middleware returns this and we can store it in property
    limits:{
        fileSize:1000000//1 MB
    },
    fileFilter(req,file,cb){
        if(! file.originalname.match(/\.(jpg|jpeg|png)$/)){
                return cb(new Error('Please upload an image (jpg/jpeg/png) '))
        }
        cb(undefined,true);
    }
})

//POST /users/me/avatar
router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{//key name is avatar
//running upload middleware before router , so to get image returned, we should not store it, in folder
    
    //to see what is the image rendered, we can use jsbin...put binary data in html--mod 14--lect 6
   
    //req.user.avatar=req.file.buffer;

    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();//save pic again ,even if already saved--bcoz resized
    req.user.avatar=buffer;   
   
   
    await req.user.save();
    res.send();//check 200 OK status for successful code
    },(error,req,res,next)=>{//next is optional, but we need to differentiate that it is function for error handling
        res.status(400).send({error:error.message})
 })


router.delete('/users/me/avatar',auth,async(req,res)=>{

    req.user.avatar=undefined;
    await req.user.save();
    res.send();
})


//to fetch user image
//test it on browser----video 7 -mod 14
router.get('/users/:id/avatar',async(req,res)=>{//set up try catch when we may or not get data
    try{
        const user=await User.findById(req.params.id)

        if(!user||!user.avatar){
            throw new Error();
        }
       // res.set('Content-Type','image/jpg')//set header--express intelligent enoughto set it automatically
       res.set('Content-Type','image/png')//bcoz now all images will be saved in png format
        res.send(user.avatar);

    }catch(e){
    res.status(404).send(e)
    }
})

 module.exports=router

