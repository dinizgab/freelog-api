import { Router } from "express";
import { AISuggestionController } from "../controller/AISuggestionController";

const router = Router();
const controller = new AISuggestionController();

router.post("/", async (req, res) => {
    await controller.createSuggestion(req, res);
});

router.get("/project/:projectId", async (req, res) => {
    await controller.getSuggestionByProjectId(req, res);
});

router.put("/project/:projectId", async (req, res) => {
    await controller.updateSuggestion(req, res);
});

router.delete("/:id", async (req, res) => {
    await controller.deleteSuggestion(req, res);
});

export default router;
