import { Request, Response } from "express";
import { DeliveryService } from "../service/DeliveryService";
import { FileUploadService } from "../service/FileUploadService";

const deliveryService = new DeliveryService();
const fileUploadService = new FileUploadService();

export class DeliveryController {
    async getAllDeliveries(req: Request, res: Response) {
        try {
            const projectId = Number(req.query.projectId);

            const deliveries = await deliveryService.getAllDeliveries(projectId);
            res.status(200).json(deliveries);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getDeliveryById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const delivery = await deliveryService.getDeliveryById(Number(id));
            if (!delivery) return res.status(404).json({ message: "Delivery not found" });
            res.status(200).json(delivery);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async createDelivery(req: Request, res: Response) {
        try {
            const {
                projectId,
                freelancerId,
                version,
                title,
                description,
                delivery_date,
                status,
            } = req.body;

            const files = req.files as Express.Multer.File[];

            const delivery = await deliveryService.createDelivery(
                {
                    projectId: Number(projectId),
                    freelancerId: Number(freelancerId),
                    version: Number(version),
                    title,
                    description,
                    delivery_date: delivery_date ? new Date(delivery_date) : undefined,
                    status,
                },
                files,
            );

            res.status(201).json(delivery);
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async updateDelivery(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const file = req.file; // Arquivo enviado via multer
            const delivery = await deliveryService.updateDelivery(Number(id), req.body, file);
            res.status(200).json(delivery);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async deleteDelivery(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await deliveryService.deleteDelivery(Number(id));
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async downloadFile(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const delivery = await deliveryService.getDeliveryById(Number(id));
            
            if (!delivery) {
                return res.status(404).json({ message: "Delivery not found" });
            }
            
            if (!delivery.delivery_file_url) {
                return res.status(404).json({ message: "No file found for this delivery" });
            }
            
            // Fazer download direto do arquivo
            const fileData = await fileUploadService.downloadFile(delivery.delivery_file_url);
            
            // Configurar headers para download
            res.setHeader('Content-Type', fileData.contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${fileData.fileName}"`);
            res.setHeader('Cache-Control', 'no-cache');
            
            // Fazer pipe do stream para a resposta
            fileData.stream.pipe(res);
            
        } catch (error) {
            console.error("Download error:", error);
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async getFileUrl(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const delivery = await deliveryService.getDeliveryById(Number(id));
            
            if (!delivery) {
                return res.status(404).json({ message: "Delivery not found" });
            }
            
            if (!delivery.delivery_file_url) {
                return res.status(404).json({ message: "No file found for this delivery" });
            }
            
            // Gerar URL com SAS token para acesso temporário (24 horas)
            const downloadUrl = await fileUploadService.generateSasUrl(delivery.delivery_file_url, 24);
            
            res.status(200).json({
                success: true,
                downloadUrl: downloadUrl,
                expiresIn: "24 hours"
            });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async submitFeedback(req: Request, res: Response) {
        try {
            const deliveryId = Number(req.query.deliveryId ?? req.body.deliveryId);
            const { status, feedback } = req.body as {
                status?: "on_review" | "approved" | "returned";
                feedback?: string | null;
            };

            if (!deliveryId || Number.isNaN(deliveryId)) {
                return res.status(400).json({ message: "deliveryId inválido" });
            }

            if (!status) {
                return res.status(400).json({ message: "status é obrigatório" });
            }

            const allowed = new Set(["on_review", "approved", "returned"]);
            if (!allowed.has(status)) {
                return res.status(400).json({ message: "status inválido" });
            }

            if (status === "returned" && !String(feedback ?? "").trim()) {
                return res.status(400).json({
                    message: "feedback é obrigatório quando status = returned",
                });
            }

            const updated = await deliveryService.submitFeedback({
                deliveryId,
                status,
                feedback: (feedback ?? "").trim() || null,
            });

            return res.status(200).json(updated);
        } catch (error) {
            console.error("submitFeedback error:", error);
            return res.status(500).json({ error: (error as Error).message });
        }
    }
}
