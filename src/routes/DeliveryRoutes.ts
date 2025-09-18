import { Router } from "express";
import { DeliveryController } from "../controller/DeliveryController";
import { uploadMiddleware } from "../middleware/uploadMiddleware";
import {DeliveryService} from "../service/DeliveryService";

const router = Router();
const deliveryController = new DeliveryController();

router.get("/", async (req, res) => {
    await deliveryController.getAllDeliveries(req, res);
});

router.get("/:id", async (req, res) => {
    await deliveryController.getDeliveryById(req, res);
});

router.get("/:id/download", async (req, res) => {
    await deliveryController.downloadFile(req, res);
});

router.get("/:id/file-url", async (req, res) => {
    await deliveryController.getFileUrl(req, res);
});

router.post("/", uploadMiddleware, async (req, res) => {
    await deliveryController.createDelivery(req, res);
});

router.put("/:id", uploadMiddleware, async (req, res) => {
    await deliveryController.updateDelivery(req, res);
});

router.delete("/:id", async (req, res) => {
    await deliveryController.deleteDelivery(req, res);
});

router.patch("/feedback", async (req, res) => {
    await deliveryController.submitFeedback(req, res);
})


router.get("/:token",
    async (req, res) => {
        const {token} = req.params;
        const delivery = await DeliveryService.getProjectFromToken(token);

        // if (!delivery) {
        //     return res.status(401).json({message: "Link inválido ou expirado"});
        // }

        res.json({
            message: "Acesso permitido",
            delivery
        });
    });

export default router;
