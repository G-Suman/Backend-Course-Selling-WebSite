import { Router } from "express";
const router = Router();
import { Users } from "../database/index.mjs";
import z from 'zod';
import argon2 from 'argon2';
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

export default router;

