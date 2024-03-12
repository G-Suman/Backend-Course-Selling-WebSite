import { Router } from "express";
import { Admins } from "../database/index.mjs";
import { z } from 'zod';
import { Courses } from "../database/index.mjs";
import adminMiddleware from "../middleware/admin.mjs";
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()
import multer from "multer";

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
const tokencreated = jwt.sign({userId} , secretKey )
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



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({storage:storage});



// courses creation
 router.post('/courses' ,adminMiddleware, upload.single('image') ,async(req,res)=>{
  const {title , description , price} = req.body;
  const image = req.file.filename;
  const userId = req.userId;


if(!title || !description || !price || !image){
  return res.status(400).json({error:"Missing required fields..."})
}

const Course = z.object({
title : z.string(),
description : z.string() ,
image : z.string(),
price : z.number()
})


try{
  const parsedPrice = parseFloat(price);
  const courseData = {title , description , price:parsedPrice , image , userId}
  Course.parse(courseData)
  const newCourse = await Courses.create(courseData);
   return res.status(201).json({
    message : `Course created Successfully of the id : ${newCourse._id}`
  })
}
catch(validationError){
  console.error(validationError)
return res.status(400).json({
error : "Validation Error" , 
details : validationError.errors
})
}

 })

 router.get('/courses',adminMiddleware,  async(req,res)=>{
  const userId = req.userId
  console.log(userId)
  try {
const courses = await Courses.find({userId});
if(courses.length === 0){
  return res.status(404).json({
    message : "No courses found for this admin"
  })
}
res.status(200).json({courses});
  }
  catch(err){
    console.error("error fetching the courses:" , err)
    res.status(500).json({ error: "Internal server error" });

  }
 })

 router.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
      error: 'An unexpected error occurred.'
  });
});






export default router;

