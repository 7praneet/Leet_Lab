import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";



dotenv.config();

const app = express();


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