import { Client } from "../model/Client";
import { Project } from "../model/Project";
import { User } from "../model/User";

export class ProjectRepository {

    async createProject(
        name: string,
        description: string,
        startDate: string,
        dueDate: string,
        budget: number,
        clientId: string,
        freelancerId: string
    ) {
        return await Project.create({
            name,
            description,
            start_date: startDate,
            due_date: dueDate,
            budget,
            client_id: clientId,
            freelancer_id: freelancerId,
        });
    }

    async getProjectById(id: number) {
        return await Project.findByPk(id, {
            include: [
                { model: Client, as: 'client', attributes: ['id', 'contactName', 'email'] },
            ]
        });
    }


    async getAllProjects(freelancerId: number) {
        return await Project.findAll({
            where: { freelancer_id: freelancerId },
            include: {
                model: Client,
                as: 'client',
                attributes: ['id', 'companyName']
            }
        });
    }

    async updateProject(
        id: number,
        data: Partial<{
            name: string;
            description: string;
            start_date: string;
            due_date: string;
            budget: number;
            client_id: string;
            freelancer_id: string;
            status: 'draft' | 'ongoing' | 'completed' | 'cancelled';
        }>
    ) {
        const project = await Project.findByPk(id);
        return project
            ? await project!.update(data)
            : null;
    }

    async deleteProject(id: string) {
        let deleted = false;
        const project = await Project.findByPk(id);
        if (project) {
            await project.destroy();
            deleted = true;
        }
        return deleted;
    }
}
