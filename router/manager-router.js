import express from 'express'
import managerController from '../exports/manager-controller.js';
import verifyToken from '../middlewares/manager/verify-request.js';
const managerRouter = express.Router();


managerRouter.post("/generate-lead", verifyToken,managerController.createLead);
managerRouter.post("/add-lead-poc", verifyToken, managerController.addLeadPOC);
managerRouter.post("/place-order", verifyToken, managerController.placeOrder);
managerRouter.post("/update-interaction", verifyToken, managerController.updateInteraction);
managerRouter.post("/set-call-frequency", verifyToken, managerController.setCallFrequency);
managerRouter.post("/get-scheduled-calls", verifyToken, managerController.getScheduledCalls);
managerRouter.post("/get-order-pattern-frequency", verifyToken, managerController.getOrderingPatternsAndFrequency);
managerRouter.post("/get-lead-performance", verifyToken, managerController.getLeadPerformance);
managerRouter.post("/change-lead-status", verifyToken, managerController.changeStatus);
managerRouter.get("/get-all-leads", verifyToken, managerController.getAllLeads);
managerRouter.post("/get-lead-by-id", verifyToken, managerController.getLeadById)
export default managerRouter;