// src/services/ProjectService.ts



import {ProjectRepository} from "../repository/ProjectRepository";
import {Project} from "../model/Project";

const projectRepository = new ProjectRepository();

class ProjectService {
    async createProject(
        name: string,
        description: string,
        startDate: string,
        dueDate: string,
        budget: number,
        clientId: string,
        freelancerId: string
    ) {
        return await projectRepository.createProject(
            name,
            description,
            startDate,
            dueDate,
            budget,
            clientId,
            freelancerId
        );
    }

    async getProjectById(id: number) {
        return await projectRepository.getProjectById(id);
    }



    async getAllProjects(freelancer_id: number) {
        return await projectRepository.getAllProjects(freelancer_id);
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
            status: 'draft' |'ongoing' | 'completed' | 'cancelled';
        }>
    ) {
        return await projectRepository.updateProject(id, data);
    }

    async deleteProject(id: string) {
        return await projectRepository.deleteProject(id);
    }
}

export default new ProjectService();
