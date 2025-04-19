import express from 'express';
import { registerUser } from '../../Controller/AuthController.js';

const routes = express.Router();

routes.get('/register', registerUser);

export default routes;