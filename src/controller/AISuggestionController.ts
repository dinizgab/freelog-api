import { Request, Response } from "express";
import { AISuggestionService } from "../service/AISuggestionService";

const aiSuggestionService = new AISuggestionService();

export class AISuggestionController {
    async createSuggestion(req: Request, res: Response) {
        try {
            const { projectId, suggestion } = req.body;

            const projectIdNumber = Number(projectId);
            if (Number.isNaN(projectIdNumber) || projectIdNumber <= 0) {
                return res.status(400).json({ message: "projectId inválido" });
            }

            if (suggestion === undefined) {
                return res.status(400).json({ message: "suggestion é obrigatório" });
            }

            const created = await aiSuggestionService.createSuggestion(projectIdNumber, suggestion);
            return res.status(201).json(created);
        } catch (error) {
            if ((error as Error).message === "Project not found") {
                return res.status(404).json({ error: (error as Error).message });
            }

            return res.status(400).json({ error: (error as Error).message });
        }
    }

    async getSuggestionByProjectId(req: Request, res: Response) {
        try {
            const projectId = Number(req.params.projectId);
            if (Number.isNaN(projectId) || projectId <= 0) {
                return res.status(400).json({ message: "projectId inválido" });
            }

            const suggestion = await aiSuggestionService.getSuggestionByProjectId(projectId);
            if (!suggestion) {
                return res.status(404).json({ message: "Sugestão de IA não encontrada" });
            }

            return res.status(200).json(suggestion);
        } catch (error) {
            return res.status(500).json({ error: (error as Error).message });
        }
    }

    async updateSuggestion(req: Request, res: Response) {
        try {
            const projectId = Number(req.params.projectId);
            if (Number.isNaN(projectId) || projectId <= 0) {
                return res.status(400).json({ message: "projectId inválido" });
            }

            const { suggestion } = req.body;
            if (suggestion === undefined) {
                return res.status(400).json({ message: "suggestion é obrigatório" });
            }

            const updated = await aiSuggestionService.updateSuggestionByProjectId(projectId, suggestion);
            return res.status(200).json(updated);
        } catch (error) {
            if ((error as Error).message === "AI suggestion not found for project" || (error as Error).message === "Project not found") {
                return res.status(404).json({ error: (error as Error).message });
            }

            return res.status(400).json({ error: (error as Error).message });
        }
    }

    async deleteSuggestion(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id) || id <= 0) {
                return res.status(400).json({ message: "id inválido" });
            }

            await aiSuggestionService.deleteSuggestionById(id);
            return res.status(204).send();
        } catch (error) {
            if ((error as Error).message === "AI suggestion not found") {
                return res.status(404).json({ error: (error as Error).message });
            }

            return res.status(400).json({ error: (error as Error).message });
        }
    }
}
