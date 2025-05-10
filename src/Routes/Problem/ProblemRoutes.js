import express from 'express';
import { getAllProblem } from '../../Controller/ProblemController.js';


const routes = express.Router();

routes.get("/getAllProblem",getAllProblem);


export default routes;