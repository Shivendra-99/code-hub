import express from 'express';
import { login, logout, registerUser, verifyUser, verifyUserId, checkUser, updateUserRole } from '../../Controller/AuthController.js';
import { authMiddleware, checkAdmin } from '../../Middleware/AuthMiddleware.js';

const routes = express.Router();

routes.post('/register', registerUser);
routes.get('/verify',verifyUser);
routes.post('/login',login);
routes.post('/logout',authMiddleware,logout);
routes.get('/check',authMiddleware,checkUser);
routes.put('/updateUserRole',authMiddleware, checkAdmin, updateUserRole)
routes.get('/verifyUserId', verifyUserId);

export default routes;