import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";



dotenv.config();

const app = express();
const JUDGE0_API_URL = process.env.JUDGE0_API_URL;


app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello guys welcome to leetlab inspired by LEETCODE!");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);


app.listen(process.env.PORT, () => {
    console.log("Server is running on http://localhost:8080");
})