import mongoose from 'mongoose';
const {Schema} = mongoose;
import dotenv from 'dotenv';
dotenv.config()

const databaseConnection = async ()=>{
try {
const url = process.env.MONGODB_URI;
await mongoose.connect(url)
console.log("MongoDb connected Sucessfully")
}
catch(err){
console.error(err)
}
}
databaseConnection()


const adminSchema = new Schema ({
   name : {type: String , required : true , unique:true ,  max:30 },
   username: {type: String , trim : true  , unique : true , required: true},
   password : { type : String , required:true}
})

const courseSchema = new Schema({
   title: { type: String, required: true },
   description: { type: String, required: true },
   image: { type: String, required: true },
   price: { type: Number, required: true, min: 0 },
   userId: { type: Schema.Types.ObjectId, ref: 'Admins', required: true } 
 });


const Admins = mongoose.model('admin' , adminSchema)
const Courses = mongoose.model('course' , courseSchema)

export {Admins , Courses} ;