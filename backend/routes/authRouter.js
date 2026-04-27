import express from 'express';
import { login, logout, signup } from '../controllers/auth.controller.js';
//import { login, logout, signup } from '../controller/authController.js';

const authRouter=express.Router();

authRouter.post('/signup',signup);
authRouter.post('/login',login);
authRouter.get('/logout',logout)
export default authRouter;
