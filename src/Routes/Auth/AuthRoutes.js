import express from 'express';
import { login, logout, registerUser, verifyUser, verifyUserId, checkUser } from '../../Controller/AuthController.js';
import { authMiddleware } from '../../Middleware/AuthMiddleware.js';

const routes = express.Router();

routes.post('/register', registerUser);
routes.get('/verify',verifyUser);
routes.post('/login',login);
routes.post('/logout',authMiddleware,logout);
routes.get('/check',authMiddleware,checkUser);
routes.get('/verifyUserId', verifyUserId);

export default routes;