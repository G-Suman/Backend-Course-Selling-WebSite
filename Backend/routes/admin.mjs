import { Router } from "express";
import { Admins } from "../database/index.mjs";
import { z } from 'zod';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

const router = Router();

router.post('/signup', async function (req, res) {
    const { name, username, password } = req.body;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            error: "Password must be at least 8 characters long and include one lowercase letter, one uppercase letter, one number, and one special character"
        });
    }
    const adminSchema = z.object({
        name: z.string(),
        username: z.string().email(),
        password: z.string()
    });
   try{
    const data = {name , username , password}
   adminSchema.parse(data);
   const existingUser = await Admins.findOne({name : name})
   if(!existingUser){
    const hashedPassword = await argon2.hash(password)
    await Admins.create({name , username , password:hashedPassword})
  return   res.status(201).json({
    message : "Admins created successfully...."
  })
}
return    res.status(400).json({
    message : "Users already exists....."
 })
   }
catch(err){
console.error(err)
 return res.status(400).json({
    error : `Internal Server Error , Admin could not be created`
})
}
});
// login route 

router.post('/login' , async (req,res)=>{
  const {username , password } = req.body;
 try{
  const existingUser =await Admins.findOne({username: username})
  if(!existingUser){
    return res.status(403).json({
error : "must signup at first ... "
    })
  }
  const secretKey = process.env.Secret;
  const userId = existingUser._id;
  console.log(userId)
const tokencreated = jwt.sign({userId} , secretKey , {expiresIn:'1h'})
 return res.status(201).json({
  token : tokencreated
})
 }
  catch(err){
console.error(err)
res.status(500).json({
  message : "unable to login try again ...."
})
  }
})




export default router;
