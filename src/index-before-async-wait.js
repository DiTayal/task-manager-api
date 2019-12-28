const express=require('express')
require('./db/mongoose.js');//so that mongoose file runs and connection with mongoDB established....
const User=require('./models/user.js');
const Task=require('./models/task.js');

const app=express();

//const port=process.env.PORT||3000;


//to automatically parse incoming json to object
app.use(express.json());

app.post('/users',(req,res)=>{
   // console.log("testing!");
   //    console.log(req.body);
   //    res.send("testing")

    const user=new User(req.body);

    user.save().then(()=>{
        console.log(user);
        res.send(201).send(user);//sent to postman
    }).catch((error)=>{
       // console.log(error);
       
res.send(400).send(error);//chaining
       /*
       res.status(400);
       res.send(error);
       */
    })

})


//see monoose drivers------------->  mongoosejs--------->docs--------->queries on models dirct
//use of mongoose over mongodb----create models and structure data in nicer way....also convert string id to object id automattically---like in find function......
app.get('/users',(req,res)=>{ 
    User.find({
        //here we passes search quesry--like in mongo db---but if no quesry,means fetch all users
    }).then((users)=>{
        res.send(users)

    }).catch((e)=>{
        res.status(500).send(e)
    })
})


app.get('/users/:id',(req,res)=>{
    //console.log(req.params);//params take the parameters form url---when do console log------we get id
    const _id=req.params.id;
    //console.log(_id);

    User.findById(_id).then((user)=>{
        if(!user)//get no matching data
        {
             res.status(404).send()//run when enter 12 digit id..ie of same length as the correct id....but if its length is different..then get 500 vala error
             /*
              The findById method will throw an error if the id you pass it is improperly formatted so you should see a 500 error 
              most of the time. However, if you pass in an id that is validly formatted, but does not exist in the database then
             you will get the 404 sent back.
             */
        }
        else
        res.send(user)

    }).catch((e)=>{
        res.status(500).send(e);
        //res.send(e)
    })
})



app.post('/task',(req,res)=>{
    // console.log("testing")------visual code
     //res.send("**testing**");----postman
 
     const task=new Task(req.body);
     task.save().then(()=>{
         console.log(task)
         res.status(201).send(task)
     }).catch((error)=>{
         res.status(400).send(error);
     })
 })

app.get('/tasks',(req,res)=>{
    Task.find({

    }).then((tasks)=>{
        res.send(tasks)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})


app.get('/tasks/:id',(req,res)=>{
    const _id=req.params.id;
    Task.findById(_id).then((task)=>{
        if(!task){
            return res.status(404).send()
        }
        res.send(task);
    }).catch((e)=>{
       // res.send(500).send(e);----wrong
       res.status(500).send(e);
    })
})

//https://httpstatuses.com/------------if we have some invalid data.being entered...then still status code is 200 ok...to change that....set status code

app.listen(port,()=>{
    console.log("Server is up on port "+port)
})