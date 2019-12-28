//npm i mongoose
// npm i validator---------to have more complex validations
//db must be started-using taht path command
//using mongoose gives-basic level of validation is acheieved.when define type


////////////////////--------------------------sir said to install nodemon as local depenedncy---npm i nodemon --save-dev------but i didnt as i had nodemon as global dependency------module 9 video 10

const mongoose=require('mongoose')
const validator=require("validator")

//similar to how we establich mongodb connection.here give url ad database name combined
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true//have index for mongoose and mongo DB so that we can fetch data
})


// const Task=mongoose.model("Task",{
//     description:{
//         type:String,
//         required:true,
//         trim:true,
//     },
//     completed:{
//         type:Boolean,
//         default:Boolean//if not given,assume not completed
//     }
// })
// /*
// const task=new Task({//if put array---error????????????/
//   //  description:'diary      '
//     //completed:false
// })

// task.save().then(()=>{
//     console.log(task)
// }).catch((error)=>{
//     console.log('Error!',error)
// })


// */






//after calling save on me...return promise
// me.save().then((result)=>{
// console.log(result);
// }).catch((error)=>{
// console.log(error)
// })

//sir's method
// mes.save().then(()=>{
//     console.log(me);
//     }).catch((error)=>{
//     console.log('Error!',error)
//     })
