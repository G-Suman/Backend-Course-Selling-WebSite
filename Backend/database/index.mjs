import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()

const connectToDatabase = async ()=>{
try {
const url = process.env.MONGODB_URI;
await mongoose.connect(url)
console.log("MongoDb connected Sucessfully")
}
catch(err){
console.error("Failed to connect to MongoDB:" , err)
}
}
connectToDatabase()


const adminSchema = new mongoose.Schema ({
   name : {type: String , required : true , unique:true ,  maxlength:30 },
   username: {type: String , trim : true  , unique : true , required: true},
   password : { type : String , required:true}
  
})

const courseSchema = new  mongoose.Schema({
   title: { type: String, required: true },
   description: { type: String, required: true },
   image: { type: String, required: true },
   price: { type: Number, required: true, min: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admins', required: true } 
 });


 const userSchema = new mongoose.Schema ({

   name : {type: String , required : true , unique:true ,  max:30 },
   username: {type: String , trim : true  , unique : true , required: true},
   password : { type : String , required:true},
   purchasedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
}]
 })

const Admin = mongoose.model('admin' , adminSchema)
const Course = mongoose.model('course' , courseSchema)
const User = mongoose.model('users' , userSchema)

export {Admin , Course , User} ;