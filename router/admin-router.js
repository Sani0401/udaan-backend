import express from 'express'
import adminController from '../exports/admin-controller.js';
const adminRouter = express.Router();


adminRouter.post("/create-manager",adminController.createAccountManager );
adminRouter.post('/login-manager', adminController.loginAccountManager)

export default adminRouter;