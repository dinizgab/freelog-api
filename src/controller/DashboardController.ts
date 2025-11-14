import { Request, Response } from "express";
import DashboardService from "../service/DashboardService";

class DashboardController {
    async getDashboard(req: Request, res: Response) {
        try {
            const { freelancerId } = req.params;
            const dashboardData = await DashboardService.getDashboardData(Number(freelancerId));
            return res.status(200).json(dashboardData);
        } catch (error) {
            console.error("Erro ao carregar dashboard", error);
            return res.status(500).json({ message: "Erro ao carregar dashboard" });
        }
    }
}

export default new DashboardController();
