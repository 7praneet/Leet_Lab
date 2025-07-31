import express from 'express';
import { authMiddleware, checkAdmin } from '../middleware/auth.middleware.js';
import { createProblem, deleteProblem, getAllProblems, getAllSolvedProblems, getProblemById, updateProblem } from '../controllers/problem.controller.js';


const problemRoutes = express.Router();

problemRoutes.post("/create-problem", authMiddleware , createProblem )

problemRoutes.get("/get-problems", authMiddleware, getAllProblems);

problemRoutes.get("/get-problem/:id", authMiddleware, getProblemById);

problemRoutes.put("/update-problem/:id", authMiddleware,checkAdmin, updateProblem);

problemRoutes.delete("/delete-problem/:id", authMiddleware, checkAdmin, deleteProblem);

problemRoutes.get("/get-solved-problems", authMiddleware, getAllSolvedProblems);

export default problemRoutes;
