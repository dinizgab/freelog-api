import { Router } from "express";
import DashboardController from "../controller/DashboardController";

const router = Router();

router.get("/dashboard/:freelancerId", (req, res) => DashboardController.getDashboard(req, res));

export default router;
