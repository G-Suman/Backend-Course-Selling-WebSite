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
   name : {type: String , require : true , unique:true ,  max:30 },
   username: {type: String , trim : true  , unique : true , require: true},
   password : { type : String , require:true}
})

const Admins = mongoose.model('admin' , adminSchema)

export {Admins} ;