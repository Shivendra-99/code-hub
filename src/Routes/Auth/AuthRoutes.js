import express from 'express';
import { login, logout, registerUser, verifyUser } from '../../Controller/AuthController.js';

const routes = express.Router();

routes.post('/register', registerUser);
routes.get('/verify',verifyUser);
routes.post('/login',login);
routes.get('/logout',logout);

export default routes;