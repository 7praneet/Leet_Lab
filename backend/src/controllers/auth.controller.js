import bcrypt from "bcryptjs";
import {db} from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js"; 
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const{email, password,name} =req.body;
    try {
        const existingUser = await db.user.findUnique({
            where:{
                email
            }
        });
        if(existingUser){
             res.status(400).json({
                error:"User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role:UserRole.USER 
            }
        });

        const token = jwt.sign({ id:newUser.id}, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.cookie("jwt", token ,{
            httpOnly:true,
            sameSite:"strict",
            secure: process.env.NODE_ENV === "development",
            maxAge: 1000*60*60*24*7 // 7 days
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user:{
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
                
            }
        });


    } catch (error) {
        console.error("Error creating user:",error);
        res.status(500).json({
            error: "Error creating user"
        });
    }
}


export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await db.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: "Invalid credentials"
            });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "development",
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        });

        res.status(201).json({
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({
            error: "Error logging in"
        });
    }
}


export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "development"
        });

        res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        console.error("Error logging out:", error);
        res.status(500).json({
            error: "Error logging out"
        });
    } 
}


export const check = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "User is authenticated",
            user: req.user // Assuming req.user is set by a middleware
        });
    } catch (error) {
        console.error("Error checking user:", error);
        res.status(500).json({
            error: "Error checking user"
        });
        
    }
}