const express=require('express')
require('./db/mongoose.js');//so that mongoose file runs and connection with mongoDB established....
const User=require('./models/user.js');
const Task=require('./models/task.js');
const userRouter=require('./routers/users.js')
const taskRouter=require('./routers/tasks.js')

const app=express(); 

const port=process.env.PORT;//||3000;
//-------environment variable file---take care of spaces,as they effect env variables
//and in dev script.... -f need to do... https://www.udemy.com/course/the-complete-nodejs-developer-course-2/learn/lecture/13729422#questions/8758044
//we may or not have nodemon as dev dependency, we can still use script dev in package.json file

const multer=require('multer');
const upload=multer({
    dest:'images',//---dont save in folder,so that middleware returns this and we can store it in property
    limits:{
        fileSize:1000000,//in Bytes---1 MB
    },
    fileFilter(req,file,cb){


        // if(!file.originalname.endsWith('.pdf')){
        //     return cb(new Error("Please upload PDF"));
        // }//for allowing multiple xtensions ,use else if or || in if statement//or use regex

        if(!file.originalname.match(/\.(doc|docx)$/) ) { //match is used for regex  ----- https://regex101.com/   ----mod 14 ----video 3
            return cb(new Error("Please upload a word document"));
        }
        //regular expression----backslash means take literal meaning of special character and $ means ending...ie, fix number of charatcers as per given regex
        //write regex in / ----- /
        //spaces also matter in regEX
        cb(undefined,true)
        // cb(new Error("Please upload PDF"));
        // cb(undefined,true);//accept request
        // cb(undefined,false)//reject request---but we wont use, as we will use the error one
    }
})

    app.post('/upload',upload.single('upload'),(req,res)=>{//second arg  is middleware  and string passed is what is searched for in requset---form-data
        
        res.send();
    },(error,req,res,next)=>{//third argument exlanation ---custom errors video 5 mod-14
       res.status(400).send({error:error.message});
    })
//to open file, give extension manually


//middleware--since in index file-so will run before every request..but if want middleware to run only
// before some routes, make midlleware function  as argument in route handling


// app.use((req,res,next)=>{
// //console.log(req.method,req.path);
// if(req.method==='GET'){
//     res.send("Get requests are disabled")//else will kee on showing loading data
// }else{
//     next();//must otherviz wont execute  next instruction
// }
// })



//code for maintenance
// app.use((req,res,next)=>{
//         res.status(503).send("The site is down.Please try back soon!")
// })

//to automatically parse incoming json to object

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

//https://httpstatuses.com/     ---if we have some invalid data.being entered...then still status code is 200 ok...to change that....set status code

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

/*

const main=async ()=> {

----here from tasks linked users
    const task=await Task.findById("5e04df2f2ca26e268c6df0e6");
    await task.populate('owner').execPopulate()
    //'ownwer' means owner field of task should have all owner info

    console.log(task.owner);//to link owner and task....we can use mongoose...to fetch owner info of the task from users db---make ref property in task model 

    console.log("=================================================")
    console.log(task);

//link users to tasks

//const user=await User.findById("5e04df0f2ca26e268c6df0e3");
//await user.populate('tasks').execPopulate();
// console.log(user.tasks)//need to create a property tasks for user model
// console.log("=================================================")
// console.log(user)

}

main();
*/

/*
//hiding data
const pet={
    name:'Tommy'
}
console.log(pet);
console.log("2   "+JSON.stringify(pet));

pet.toJSON=function(){
  
    console.log("inside tojson")
    console.log(this)
    //return this;/what we return becomes final value of object and it is stringified
    return "h";
}

console.log("3  "+pet);//string + object becomes string
console.log("3  ",pet);
console.log("4  ");
console.log(pet);
console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=')
console.log("5  "+JSON.stringify(pet));
console.log(6);
console.log(JSON.stringify(function(){console.log("2")}))//----stringify  a functiomn gives undefined
console.log(7);
console.log(JSON.stringify({toJSON(){console.log("2")}}))
console.log(8);
console.log(JSON.stringify(function toJSON(){console.log("2")}))
console.log(9);
console.log({toJSON:function(){
    console.log("hellllllllllllo");
    return "bye"//jo tojson return karta vhi serialis ehota hai, ie stringified
}})

console.log(10);
console.log(JSON.stringify(
    {toJSON:function(){
    console.log("hellllllllllllo");
    return "bye"
    }
}
))



console.log(11);
console.log(JSON.stringify(
    {toJSON:function(){
    console.log("hellllllllllllo");
    return "bye"
    }
}
))


console.log(12);
console.log(JSON.stringify(
    {
    toJSON(){
    console.log("hellllllllllllo");
    return "bye"
    },
     doWork(){//function
        console.log("standard function")//not run in stringify

    }
}
))
*/


/*
const jwt=require('jsonwebtoken');

const myFunction=async()=>{

    const token=jwt.sign({_id:'123ad'},'Dishika',{expiresIn:'1 days'});//2 args--- object,string(seret key)
    //{expiresIn:'1 seconds'}??????????/
    console.log(token);
    //decode-----base64decode.org
    const data=jwt.verify(token,'Dishika');//space also matters in signature string
    //return payload if successful  
    console.log(data);
}

myFunction();
*/ 



// const bcrypt=require('bcrypt');

// const myFun=async()=>{

//     const password='Red123';
//     const hashedpassword=await bcrypt.hash(password,8);//8 means how many times run algo
//     console.log(password)
//     console.log(hashedpassword)

//     const check=await bcrypt.compare('Red123',hashedpassword);
//     console.log(check)
// }

// myFun();
//encryption ----- Dolly ->   dxsfsecddcas -> Dolly
//hashing --------DOlly   ->dscfkjfgcskfdcskd

