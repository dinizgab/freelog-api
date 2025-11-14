import { Router } from "express";
import DashboardController from "../controller/DashboardController";

const router = Router();

router.get("/dashboard/:freelancerId", async (req, res) => {
    await DashboardController.getDashboard(req, res);
});


export default router;
