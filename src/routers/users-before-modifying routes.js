const express=require('express')

const User=require('../models/user.js');
const auth=require('../middleware/auth.js')
const router=new express.Router();//why?????????????????????????


router.post('/users',async(req,res)=>{//this function returns promise-----async wait
    const user=new User(req.body);//to save data...create a model

    try{
        await user.save();
        const  token=await user.generateAuthToken();//generate toke, when save user and when login
        //res.status(201).send(user);
        res.status(201).send({user,token});
    }catch(e){
res.status(400).send(e);
    }

    // user.save().then(()=>{
    //     console.log(user);
    //     res.send(201).send(user);//sent to postman
    // }).catch((error)=>{       
    // res.sttus(400).send(error);//chaining
    // })
})


router.post('/users/login',async(req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        const token=await user.generateAuthToken();//we want to genertae token for very individual user...so use user
       // res.send(user)
       res.send({user,token})//sending in respomse token also
        
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
        res.status(200).send({msg:'Logged out successfully from all devices'});

    }catch(e){
        res.status(500).send(e);
    }
})



//see monoose drivers------------->  mongoosejs--------->docs--------->queries on models dirct
//use of mongoose over mongodb----create models and structure data in nicer way....also convert string id to object id automattically---like in find function......
            

router.get('/users/me',auth,async (req,res)=>{ 
    res.send(req.user);

})



//dont show all users list---modify to send own's profile

            // router.get('/users',auth,async (req,res)=>{ 

            //     try{
            //         const users=await User.find({})//to get data apply function on model
            //         res.status(201).send(users)
            //     }catch(e){
            //         res.status(500).send(e);
            //     }

            //     // User.find({
            //     //     
            //     // }).then((users)=>{
            //     //     res.send(users)

            //     // }).catch((e)=>{
            //     //     res.status(500).send(e)
            //     // })
            // })


router.get('/users/:id',async(req,res)=>{
    //console.log(req.params);//params take the parameters form url---when do console log------we get id
    const _id=req.params.id;

    try{
        const user=await User.findById(_id);//await must to write-else function not run   why?????????????//

        if(!user){
            return res.status(404).send();
        }
        res.send(user);

    }catch(e){
        res.status(500).send(e);
    }

    // User.findById(_id).then((user)=>{
    //     if(!user) {
    //          res.status(404).send()
    //     }
    //     else
    //     res.send(user)

    // }).catch((e)=>{
    //     res.status(500).send(e);
    //     //res.send(e)
    // })
})


//patch is http method for  handling urls of updating data 

router.patch('/users/:id',async(req,res)=>{
    const updates=Object.keys(req.body);//to convert an object into array of its properties
    const allowedUpdates=['name','password','age','email'];
    //every single property must be in allowed updates

    //return true only if for all update it returns true
    const isValidOperation=updates.every((update)=>{
        return allowedUpdates.includes(update);
    })//can shortcut it syntax
    if(!isValidOperation){
       // return res.status(400).send("Error:Invalid updates");
       return res.status(400).send({error:'invalid updates!'})//sending object
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
        const user=await User.findById(req.params.id);
        //update properties changed
        updates.forEach((update)=>{
            user[update]=req.body[update]
            //cant us edot notation, bcoz then will have to explicitly tell the property  
        })
        await user.save();//bcoz abhi values sirf change ki hai, par not saved

        if(!user){
            return res.status(404).send();
        }
        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }    
})


router.delete('/users/:id',async(req,res)=>{
    try{
        const user=await User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(404).send();
        }
        res.send(user);
    }catch(e){
    res.status(500).send(e);
    }

})

module.exports=router
