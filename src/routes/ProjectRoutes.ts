import {Router} from "express";
import ProjectController from "../controller/ProjectController";
import {authenticate, authorizeUser} from "../middleware/authMiddleware";

const router = Router();


router.post("/project/", (request, response) => {ProjectController.createProject(request, response)});
router.get("/projects/:id", authenticate, (request, response) => {ProjectController.getAllProjects(request, response)});
router.get("/project/:id", authenticate,(request, response) => {ProjectController.getProjectById(request, response)});
router.put("/project/:id",authenticate, authorizeUser, (request, response) => {ProjectController.updateProject(request, response)});
router.delete("/project/:id", authenticate, authorizeUser,  (request, response) => {ProjectController.deleteProject(request, response)});
export default router;
