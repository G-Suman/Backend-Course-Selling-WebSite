import mongoose from 'mongoose'; // odm for the nosql database.
import dotenv from 'dotenv'; // third party libary , to keep the secrecy of the sensitive data
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
const Admins = mongoose.model('admin' , adminSchema)
const Courses = mongoose.model('course' , courseSchema)
const Users = mongoose.model('users' , userSchema)

export {Admins , Courses , Users} ;
