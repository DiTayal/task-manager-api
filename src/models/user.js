const mongoose=require('mongoose')
const validator=require("validator")
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const Task=require('./task');//to delete all tasks of a user which is being deleted

//to store password--hash it--we can do when we  do create user or update user---but can write code only once, 
//if we use middleware in mongoose---ie---a piece of code that runs before anything happens---docs---middleware

//when creare model,second argument is object---which is converted to schema at backend by mongoose...but if we want to use
//middleware we need to make schema firt

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,//so taht cant have more than 1 user with same email
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                    throw new Error("Enter valid email!")
            }
        }
    },
    age:{
         type:Number,
         default:0,//sine not required.......so can give default value
         validate(value){
             if(value<0){
                 throw new Error("Age must be > 0")
             }             
         }
    },
    password:{//length greaterr than 6
        type:String,
        required:true,
        trim:true,
        minlength:7,//or custom validator-ie make yourself
        validate(value){
            if(value.length<=6){
                throw new Error("password length should be greater than 6!")
            }
            if(value.toLowerCase().includes("password")){//if(value.includes("password"))-to deal with pAssword
                throw new Error('password cannot contain "password"')
            }
        },
    },
    tokens:[{//to track tokens, so that usesr can logout and can stay logged in form multiple devices
        token:{
            type:String,
            required:true,
        }
    }],
    avatar:{
        type:Buffer,//to store binary data of profile pic as we cant store in folder, as data loss during deployment...
    }
},{
    timestamps:true//SO That when was document created and updated is stored
})

//virtual does not store data in DB but define relationship
//create a virtual property for user
userSchema.virtual('tasks',{//tasks is name of virtual property as we have owner as real property in Task model
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

//need this binfing..so standard function
//methods is method called by instance


//userSchema.methods.getPublicProfile=function(){
userSchema.methods.toJSON = function(){//this functoin run even if we r not explicitly calling it-------
    /*

    The res.send() method checks if what we're sending is an object. If it is, then it calls JSON.stringify() on it 
     which in turn calls our toJSON method.
     bcoz res.send() calls JSON.stringify() behind the scenes

    */
    const user=this;

    const userObj=user.toObject();//to get raw data-------as mongoose also attaches some data
    
    delete userObj.password;
    delete userObj.tokens;
    delete userObj.avatar;//else slow down showing data

    return userObj;
}


userSchema.methods.generateAuthToken=async function(){//instance methods
    const user=this;
    const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens=user.tokens.concat({token:token})
    
    await user.save();

    return token;

}

//middleware--to avoid repetition of code in router,make code at one place
//second argument is standard function and not arrow function as bindings important
//statics means this function called as we have a call
//statics is method called by models


userSchema.statics.findByCredentials=async(email,password)=>{//model methods

    const user=await User.findOne({email});
    if(!user){
        throw new Error('Unable to login!')
    }
    //check password now

    const isSame=await bcrypt.compare(password,user.password);
    
    if(!isSame){
        throw new Error('Unable to login!')
    }
    return user
}


//Hash the palin text of password before saving
userSchema.pre('save',async function(next){
    const user=this//user about to be saved

//    console.log("before saving ")
    //hash password if password is not modified............
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8); 
    }

    next();//to indicate that the code to run before save has been executed completely
})

userSchema.pre('remove',async function(next){
    const user=this;

    await Task.deleteMany({owner:user._id})
    next();
})

const User=mongoose.model('User',userSchema);

module.exports=User;

// const User=mongoose.model('User',{//first arg is name of model------name of collection---lowercase+pluralises it
//     name:{
//         type:String,
//         required:true,
//         trim:true,
//     },
//     email:{
//         type:String,
//         required:true,
//         trim:true,
//         lowercase:true,
//         validate(value){
//             if(!validator.isEmail(value)){
//                     throw new Error("Enter valid email!")
//             }
//         }
//     },
//     age:{
//          type:Number,
//          default:0,//sine not required.......so can give default value
//          validate(value){
//              if(value<0){
//                  throw new Error("Age must be > 0")
//              }             
//          }
//     },
//     password:{//length greaterr than 6
//         type:String,
//         required:true,
//         trim:true,
//         minlength:7,//or custom validator-ie make yourself
//         validate(value){
//             if(value.length<=6){
//                 throw new Error("password length should be greater than 6!")
//             }
//             if(value.toLowerCase().includes("password")){//if(value.includes("password"))-to deal with pAssword
//                 throw new Error('password cannot contain "password"')
//             }
//         },
//     }
// })
// module.exports('User');



// const me=new User({
//     name:'Dishika',
//     email:'abc@gmail.com',
//     age:20,
//     password:'ghsword12 fd               '

// })

// me.save().then(()=>{
//     console.log(me);
// }).catch((error)=>{
//     console.log(error);
// })
