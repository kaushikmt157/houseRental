import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import { User } from "../models/user.models.js";
import fs from 'fs';

const router = Router();

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/uploads/") // Stores uploaded files in the uploads folder 
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname) // Use the original file name
    }
})

const upload = multer({ storage })

// User Registration
router.post("/register", upload.single('profileImage'), async (req, res) => {
    
    try {
        // Take all information from user registration form
        const {firstname, lastname, email, password} = req.body;

        // Take the uploaded profile image file (The uploaded file is available as req.file)
        const profileImage = req.file

        if(!profileImage) {
            return res.status(400).send("Profile image file not uploaded")
        }

        // Path to the uploaded profile image
        const profileImagePath = profileImage.path;

        // Check if user already exists
        const existedUser = await User.findOne({ email })
        if(existedUser) {
            return res.status(408).json({ message: "User already exists."})
        }

        // Hash the password before storing to database
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashPassword,
            profileImagePath
        });

        // Save the newly created user to the database
        await newUser.save()

        // Send a success message
        res.status(200).json({ message: "User registered successfully.", user: newUser})
        
        //TODO: Remove uploaded profile image from local
    } catch (err) {
        console.log("ERROR: Error occured while creating the user - ", err);
        res.status(500).json({ message: "Registration failed.", error: err.message})
    }
})

// User login
router.post("/login", async (req, res) => {
    try {
        // Take the information from the login form
        const {email, password} = req.body
        
        // Check if user exists
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(408).json({ message: "User does not exists."})
        }
        
        // Compare the password with the hashed password
        const isMatching = await bcrypt.compare(password, user.password)
        if(!isMatching) {
            return res.status(400).json({ message: "Invalid credentials."})
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY)
        delete user.password

        res.status(200).json({ token, user })
    } catch (err) {
        console.log("ERROR: Login error - ", err)
        res.status(200).json({ error: err.message })
    }
})

export default router;