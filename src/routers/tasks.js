const express=require('express');
const Task=require('../models/task')
const auth=require('../middleware/auth.js')

//app=express();----this also works
const router=new express.Router();

//app.post('/task',async(req,res)=>{

router.post('/task',auth,async(req,res)=>{
    // console.log("testing")------visual code
     //res.send("**testing**");----postman
 
  //   const task=new Task(req.body);
  const task=new Task({
      ...req.body,
      owner:req.user._id
  })
     try{
         await task.save();
         res.status(200).send(task)
     }catch(e){
        res.status(400).send(e);
     }
 })

 //pagination is dividing data on pages
 //GET tasks? completed = true
 //GET tasks?limit=2&skip=0
 //GET tasks?sortBy=createdAt:asc//can use any special character to provide asc or desc like _ or :
router.get('/tasks',auth,async(req,res)=>{

    const match={}   
    const sort={}

    //console.log(req.query.completed);

    if(req.query.completed){
        match.completed=req.query.completed==='true';//bcoz query return string, but we need boolean
    }

    if(req.query.sortBy){
        const parts=req.query.sortBy.split(':');
        sort[parts[0]]=(parts[1]==='desc'?-1:1);//cant set like sortBy.createdAt....so need to use []
    }

try{
    //await req.user.populate('tasks').execPopulate()
    await req.user.populate({
        path:'tasks',
        match,
        options:{//if any key is undefined, it is ignored
            limit:parseInt(req.query.limit),//can set static also,,,limit:2
            skip:parseInt(req.query.skip),//limit =2 &skip = 2 wont skip 2 pages conatining enteries=limit but it will skip 2 enteries and show third entry
            // sort:{
            //     completed:1,//createdAt:-1//-1 measn descending
            // }
            sort
        }
    }).execPopulate()

    res.send(req.user.tasks)

}catch(e){
    res.status(500).send(e)
}
})

/*

router.get('/tasks',auth,async(req,res)=>{

try{
   // const tasks=await Task.find({})


   //1
   //const tasks=await Task.find({owner:req.user._id})
    //res.send(tasks)

    //or  2
    await req.user.populate('tasks').execPopulate()
    res.send(req.user.tasks)

}catch(e){
    res.status(500).send(e)
}
})
*/


router.get('/tasks/:id',auth,async(req,res)=>{
    const _id=req.params.id;

    try{
      //  const task=await Task.findById(_id);
      const task=await Task.findOne({_id,owner:req.user._id})
        if(!task){
            res.status(404).send(task)
        }
        else{
            res.send(task);
        }
    }catch(e){
        res.status(500).send(e);
    }
})


router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates=Object.keys(req.body);
    const allowedUpdates=['description','completed'];
    const isValidUpdate=updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidUpdate){
        return res.status(400).send({error:'Invalid updates'});
    }
    try{
   // const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
  // const task=await Task.findById(req.params.id);
  const task=await Task.findOne({_id:req.params.id , owner:req.user._id})//if use find not run

  
    if(!task){
        return res.status(404).send();
    }

    updates.forEach((update)=>task[update]=req.body[update])

    task.save();
 
    res.send(task)

    }catch(e){
        res.status(400).send(e);
    }
})

router .delete('/tasks/:id',auth,async(req,res)=>{
    try{
       // const task=await Task.findByIdAndDelete(req.params.id);
       const task=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    }catch(e){
        res.status(500).send(e);
    }
})

//module.exports=app;
module.exports=router;