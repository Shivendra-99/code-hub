import express from 'express';
import { getAllProblem,createProblem, getProblemById, updateProblemById, getSolvedProblem } from '../../Controller/ProblemController.js';
import { authMiddleware, checkAdmin } from '../../Middleware/AuthMiddleware.js';
import { resourceLimits } from 'worker_threads';

const routes = express.Router();

routes.get("/getAllProblem",authMiddleware,checkAdmin,getAllProblem);
routes.post("/createProblem",authMiddleware,checkAdmin,createProblem);
routes.get("/getProblem:Id",authMiddleware, getProblemById);
routes.delete("/deleteProblem:Id",authMiddleware, checkAdmin,getProblemById);
routes.put("/updateProblem:Id",authMiddleware, checkAdmin,updateProblemById);
routes.get("/getSolvedProblem",authMiddleware, getSolvedProblem);

export default routes;