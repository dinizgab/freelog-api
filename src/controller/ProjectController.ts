import {Request, Response} from "express";
import ProjectService from "../service/ProjectService";
import UserService from "../service/UserService";

class ProjectController {
    async createProject(request: Request, response: Response): Promise<Response> {
        try {
            const {
                name, description, startDate, dueDate, budget, clientId, freelancerId,
            } = request.body;

            const project = await ProjectService.createProject(name, description, startDate, dueDate, budget, clientId, freelancerId);
           return response.status(201).json(project);
        } catch (error) {
            return response.status(500).json({msg: 'Erro ao criar projeto', error: error});
        }
    }

    async getProjectById(request: Request, response: Response): Promise<Response> {
        try {
            const project = await ProjectService.getProjectById(parseInt(request.params.id));

            return !project
                ? response.status(404).json({ error: 'Projeto não encontrado' })
                : response.status(200).json(project);
        } catch (error) {
            return response.status(500).json({ error: 'Erro ao buscar projeto' });
        }
    }


    async getAllProjects(request: Request, response: Response): Promise<Response> {
        try {

            const projects = await ProjectService.getAllProjects(Number(request.params.id));
            return response.status(200).json(projects);
        } catch (error) {
            return response.status(500).json({ error: 'Erro ao listar projetos' });
        }
    }

    async updateProject(request: Request, response: Response): Promise<Response> {
        try {
            const project = await ProjectService.updateProject(Number(request.params.id), request.body);
            return !project
                ? response.status(404).json({ error: 'Projeto não encontrado' })
                : response.status(200).json(project);
        } catch (error) {
            console.log(request.params.id)
            return response.status(500).json({msg: 'Erro ao atualizar projeto', error: error});

        }
    }

    async deleteProject(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;
            const success = await ProjectService.deleteProject(id);

            return !success
                ? response.status(404).json({ error: 'Projeto não encontrado' })
                : response.status(204).send();
        } catch (error) {
            return response.status(500).json({ error: 'Erro ao excluir projeto' });
        }
    }
}

export default new ProjectController();