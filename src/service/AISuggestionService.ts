import { AISuggestion } from "../model/AISuggestion";
import { Project } from "../model/Project";
import { AISuggestionRepository } from "../repository/AISuggestionRepository";

export class AISuggestionService {
    private repository: AISuggestionRepository;

    constructor() {
        this.repository = new AISuggestionRepository();
    }

    private async ensureProjectExists(projectId: number) {
        const project = await Project.findByPk(projectId);
        if (!project) {
            throw new Error("Project not found");
        }
    }

    async createSuggestion(projectId: number, suggestion: unknown): Promise<AISuggestion> {
        await this.ensureProjectExists(projectId);

        const existing = await this.repository.findByProjectId(projectId);
        if (existing) {
            return await existing.update({ suggestion });
        }

        return await this.repository.create(projectId, suggestion);
    }

    async getSuggestionByProjectId(projectId: number) {
        return await this.repository.findByProjectId(projectId);
    }

    async updateSuggestionByProjectId(projectId: number, suggestion: unknown) {
        await this.ensureProjectExists(projectId);

        const updated = await this.repository.updateByProjectId(projectId, suggestion);
        if (!updated) {
            throw new Error("AI suggestion not found for project");
        }

        return updated;
    }

    async deleteSuggestionById(id: number) {
        const deleted = await this.repository.deleteById(id);
        if (!deleted) {
            throw new Error("AI suggestion not found");
        }
    }
}
