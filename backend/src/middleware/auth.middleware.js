import jwt from 'jsonwebtoken';
import {db} from '../libs/db.js';

export const authMiddleware = async(req, res, next) => {
    try{
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorizeed access"
        });
    }
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
    const user = await db.user.findUnique({
        where: {
            id: decoded.id
        },
        select: {
            id: true,
            email: true,
            name: true,
            role: true      
        }
    });

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "User not found"
        });
    }
    req.user = user;
    next();
}catch (error) {
    console.error("Error in auth middleware:", error);
    return res.status(500).json({
        success: false,
        message: "Internal server error"
    });
}
}