import { Router } from "express";
const router = Router();
import { Admins, Courses, Users } from "../database/index.mjs";
import z from 'zod';
import argon2 from 'argon2';
import dotenv from 'dotenv';
dotenv.config()
import jwt from "jsonwebtoken"
import userMiddleware from "../middleware/user.mjs";

router.post('/signup', async (req, res) => {
    const { name, username, password } = req.body;
    try {
        const existingUsers = await Users.findOne({ name: name });
        if (existingUsers) {
            return res.status(400).json({
                message: "User already exists..."
            });
        }

        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                error: "Password must be at least 8 characters long and include one lowercase letter, one uppercase letter, one number, and one special character"
            });
        }
        const hashedPassword = await argon2.hash(password)

        const userValidation = z.object({
            name: z.string(),
            username: z.string().email(),
            password: z.string()
        });

        const user = { name, username, password };
        userValidation.parse(user);

        const users = {name , username , password :hashedPassword }
        await Users.create(users);
        return res.status(201).json({
            message: "User created Successfully ... "
        });

    } catch (err) {
        console.error(err);
        if (err.errors) {
            return res.status(400).json({
                error: "Invalid credentials, did not match with the input validation..."
            });
        } else {
            return res.status(500).json({
                error: "Internal Server Error...."
            });
        }
    }
});

router.post('/login' , async(req,res)=>{
    const {username} = req.body;
    try {
        const userList = await Users.findOne({username : username})
        if(!userList){
            return res.status(403).json({
                message : " invalid crediantals, user must signup at first"
            })
        }
const SecretKey = process.env.Secret;
const userId = userList._id;
console.log(userId)

 const token = jwt.sign({userId} , SecretKey , {expiresIn : "1h"})
 res.status(200).json({
    token : token
 })

    }
    catch(err){
console.error(err)
res.status(500).json("internal server error....")
    }
})
router.get('/courses', userMiddleware, async (req, res) => {
    try {
        const coursesList = await Courses.find();
        if (!coursesList || coursesList.length === 0) {
            return res.status(404).json({
                error: "Courses not found..."
            });
        }
        return res.status(200).json({
            courses: coursesList
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Error while searching the courses...."
        });
    }
});

router.post('/courses/:courseId',userMiddleware , async(req,res)=>{
    const courseId = req.params.courseId;
    try{
        if(!courseId){
          return  res.status(404).json({
error : "Course Id didnot included..."
            })
        }
        const userId = req.userId;
        
    await Users.findByIdAndUpdate(userId , {
        $addToSet : {purchasedCourses:courseId}
    })
    res.status(200).json({
        message:"Course purchased Successfully"
    })

    }
    catch(err){
console.error(err);
res.status(500).json({
    error : "Internal Server error"
})
    }
})

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    const userId = req.userId;
    try {

        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({
                error: "User does not exist..."
            });
        }
        const purchasedCourseIds = user.purchasedCourses;
        
        if (purchasedCourseIds.length === 0) {
            return res.status(200).json({
                message: 'No courses purchased.'
            });
        }
        const purchasedCourses = await Courses.find({ _id: { $in: purchasedCourseIds } });

        if (purchasedCourses.length === 0) {
            return res.status(404).json({
                error: 'No courses found for the purchased course IDs.'
            });
        }

        res.status(200).json({
            purchasedCourses: purchasedCourses
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Internal server error.'
        });
    }
});

router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        error: 'An unexpected error occurred.'
    });
});


export default router;

