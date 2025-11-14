import { Op } from "sequelize";
import { Client } from "../model/Client";
import { Project } from "../model/Project";

class DashboardService {
    async getDashboardData(freelancerId: number) {
        const [totalClients, activeProjects, totalRevenueRaw, pendingPaymentsRaw, upcomingProjects] = await Promise.all([
            Client.count({ where: { freelancerId } }),
            Project.count({
                where: {
                    freelancer_id: freelancerId,
                    status: {
                        [Op.in]: ["draft", "ongoing"],
                    },
                },
            }),
            Project.sum("budget", {
                where: {
                    freelancer_id: freelancerId,
                    status: "completed",
                },
            }),
            Project.sum("budget", {
                where: {
                    freelancer_id: freelancerId,
                    status: {
                        [Op.in]: ["draft", "ongoing"],
                    },
                },
            }),
            Project.findAll({
                where: {
                    freelancer_id: freelancerId,
                    due_date: {
                        [Op.gte]: new Date(),
                    },
                },
                attributes: ["id", "name", "due_date", "status", "budget"],
                include: [{
                    model: Client,
                    as: "client",
                    attributes: ["id", "companyName"],
                }],
                order: [["due_date", "ASC"]],
                limit: 3,
            }),
        ]);

        return {
            totalClients,
            activeProjects,
            totalRevenue: Number(totalRevenueRaw ?? 0),
            pendingPayments: Number(pendingPaymentsRaw ?? 0),
            upcomingProjects,
        };
    }
}

export default new DashboardService();
