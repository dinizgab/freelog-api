import { Delivery } from "../model/Delivery";

export class DeliveryRepository {

    async createDelivery(
        projectId: number,
        previousDeliveryId: number | null,
        clientReview: string | null,
        status: "on_review" | "returned" | "approved",
        deliveryDate: Date | null,
        deliveryFileUrl: string | null,
        freelancerId: number,
        title: string,
        description: string,
        version: number
    ) {
        return await Delivery.create({
            project_id: projectId,
            previious_delivery_id: previousDeliveryId,
            client_review: clientReview,
            status,
            delivery_date: deliveryDate,
            delivery_file_url: deliveryFileUrl,
            freelancer_id: freelancerId,
            title: title,
            description: description,
            version: version,
        });
    }

    async getDeliveryById(id: number) {
        return await Delivery.findByPk(id);
    }

    async getAllDeliveries() {
        return await Delivery.findAll();
    }

    async updateDelivery(
        id: number,
        data: Partial<{
            project_id: number;
            previious_delivery_id: number | null;
            client_review: string | null;
            status: "on_review" | "returned" | "approved",
            delivery_date: Date | null;
            delivery_file_url: string | null;
            freelancer_id: number;
        }>
    ) {
        const delivery = await Delivery.findByPk(id);
        return delivery ? await delivery.update(data) : null;
    }

    async deleteDelivery(id: number) {
        let resp = false;
        const delivery = await Delivery.findByPk(id);
        if (delivery) {
            await delivery.destroy();
            resp = true;
        }
        return resp;
    }

}
