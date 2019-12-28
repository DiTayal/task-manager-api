const mongoose=require('mongoose');
const validator=require('validator');

//creating schema, to have timestamp cols ,to do filtering and pagination in module 13

const taskSchema=new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true,
    },
    completed:{
        type:Boolean,
        default:Boolean//if not given,assume not completed
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'//model name
    }
},{
    timestamps:true
})

const Task=mongoose.model('Task',taskSchema);

module.exports=Task;




/*
const Task=mongoose.model("Task",{
    description:{
        type:String,
        required:true,
        trim:true,
    },
    completed:{
        type:Boolean,
        default:Boolean//if not given,assume not completed
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'//model name
    }
})


*/


/*
const task=new Task({//if put array---error????????????/
  //  description:'diary      '
    //completed:false
})

task.save().then(()=>{
    console.log(task)
}).catch((error)=>{
    console.log('Error!',error)
})


*/