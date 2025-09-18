import { Delivery, DeliveryCreationAttributes } from "../model/Delivery";
import { FileUploadService } from "./FileUploadService";
import {DeliveryFile} from "../model/DeliveryFile";
import jwt from "jsonwebtoken";
import {DeliveryRepository} from "../repository/deliveryRepository";
import {EmailService} from "./EmailService";
import {User} from "../model/User";
import {Project} from "../model/Project";
import {Client} from "../model/Client";

interface CreateDeliveryDTO {
    projectId: number;
    freelancerId: number;
    version: number;
    title: string;
    description: string;
    delivery_date?: Date;
    status?: "on_review" | "approved" | "returned"
}

type DeliveryStatus = "on_review" | "approved" | "returned";


const deliveryRepository = new DeliveryRepository();

export class DeliveryService {
    private fileUploadService: FileUploadService;

    constructor() {
        this.fileUploadService = new FileUploadService();
    }

    async getAllDeliveries(projectId: number) {
        return await Delivery.findAll({
            where: { project_id: projectId },
            include: {
                model: DeliveryFile,
                as: "files",
                attributes: ["id", "name", "size", "url"],
            },
            order: [['version', 'DESC']]
        });
    }

    async getDeliveryById(id: number) {
        return await Delivery.findByPk(id);
    }

    async createDelivery(
        dto: CreateDeliveryDTO,
        files: Express.Multer.File[] = [],
    ) {
        const delivery = await Delivery.create({
            project_id: dto.projectId,
            freelancer_id: dto.freelancerId,
            title: dto.title,
            description: dto.description,
            delivery_date: dto.delivery_date ?? new Date(),
            status: dto.status ?? "on_review",
            version: dto.version,
        });

        const fileRecords: DeliveryFile[] = [];

        for (const file of files) {
            const url = await this.fileUploadService.uploadFile(file, delivery.id);

            const record = await DeliveryFile.create({
                deliveryId: delivery.id,
                name: file.originalname,
                size: file.size,
                url,
            });

            fileRecords.push(record);
        }

        const token = jwt.sign(
            { deliveryId: delivery.id },
            process.env.JWT_SECRET as string,
            { expiresIn: "24h" }
        );

        const project = await Project.findOne({
            attributes: ["id", "name", "client_id"],
            where: { id: delivery.project_id },
        });

        const client = await Client.findOne({
            attributes: ["email", "contactName"],
            where: { id: project?.client_id },
        });

        const freelancer = await User.findOne({
            attributes: ["id", "fullName"],
            where: { id: delivery.freelancer_id },
        });

        const clientEmail = client?.email as string;
        const link = `${process.env.URL_FRONT}/deliveries?projectId=${delivery.project_id}&token=${token}`;

        await EmailService.sendDeliveryEmail(clientEmail, {
            link,
            clientName: client?.contactName ?? "cliente",
            projectName: (project as any)?.name ?? (project as any)?.title ?? "Projeto",
            deliveryVersion: delivery.version ?? 1,
            deliveryTitle: delivery.title ?? "Entrega",
            freelancerName: freelancer?.fullName ?? "Freelancer",
        });

        return delivery;
    }

    static async getProjectFromToken(token: string) {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { projectId: string };
            const delivery = await deliveryRepository.getDeliveryById(parseInt(payload.projectId));
            return delivery;
        } catch {
            return null; // Token inválido ou expirado
        }
    }

    async updateDelivery(id: number, data: Partial<Delivery>, file?: Express.Multer.File) {
        const delivery = await Delivery.findByPk(id);
        if (!delivery) throw new Error("Delivery not found");

        // Se há arquivo, fazer upload
        if (file) {
            try {
                // Deletar arquivo anterior se existir
                if (delivery.delivery_file_url) {
                    await this.fileUploadService.deleteFile(delivery.delivery_file_url);
                }

                // Upload do novo arquivo
                const fileUrl = await this.fileUploadService.uploadFile(file, id);
                data.delivery_file_url = fileUrl;
            } catch (error) {
                console.error("Error uploading file:", error);
                throw new Error("Failed to upload delivery file");
            }
        }

        return await delivery.update(data);
    }

    async submitFeedback(params: {
        deliveryId: number;
        status: DeliveryStatus;
        feedback: string | null;
    }) {
        const { deliveryId, status, feedback } = params;

        const delivery = await Delivery.findByPk(deliveryId);
        if (!delivery) throw new Error("Delivery not found");

        await delivery.update({
            status,
            client_review: feedback,
        });

        return delivery;
    }

    async deleteDelivery(id: number) {
        const delivery = await Delivery.findByPk(id);
        if (!delivery) throw new Error("Delivery not found");

        // Deletar arquivo do storage se existir
        if (delivery.delivery_file_url) {
            await this.fileUploadService.deleteFile(delivery.delivery_file_url);
        }

        return await delivery.destroy();
    }
}
