import { AISuggestion } from "../model/AISuggestion";

export class AISuggestionRepository {
    async create(projectId: number, suggestion: unknown) {
        return await AISuggestion.create({
            project_id: projectId,
            suggestion,
        });
    }

    async findByProjectId(projectId: number) {
        return await AISuggestion.findOne({ where: { project_id: projectId } });
    }

    async findById(id: number) {
        return await AISuggestion.findByPk(id);
    }

    async updateByProjectId(projectId: number, suggestion: unknown) {
        const record = await this.findByProjectId(projectId);
        if (!record) {
            return null;
        }

        return await record.update({ suggestion });
    }

    async deleteById(id: number) {
        const record = await AISuggestion.findByPk(id);
        if (!record) {
            return false;
        }

        await record.destroy();
        return true;
    }
}
