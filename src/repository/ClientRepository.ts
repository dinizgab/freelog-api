import { Client } from '../model/Client'

export class ClientRepository {

    async createClient(
        companyName: string,
        contactName: string,
        contactTitle: string,
        email: string,
        phone: string,
        address: string,
        isActive: boolean,
        freelancerId: number,
    ) {
        return await Client.create({
            companyName,
            contactName,
            contactTitle,
            email,
            phone,
            address,
            isActive,
            freelancerId
        });
    }

    async getClientById(id: number) {
        return await Client.findByPk(id);
    }

    async getAllClients(freelancerId: number) {
        return await Client.findAll({
            where: { freelancerId: freelancerId },
        });
    }

    async updateClients(
        id: number,
        data: Partial<{
            companyName: string,
            contactName: string,
            contactTitle: string,
            email: string,
            phone: string,
            address: string,
            isActive: boolean,
            freelancerId: number,
        }>
    ) {
        const client = await Client.findByPk(id);
        return client
            ? await client!.update(data)
            : null;
    }

    async deleteClients(id: number) {
        let resp = false;
        const client = await Client.findByPk(id);
        if (client) {
            await client!.destroy()
            resp = true;
        }
        return resp;

    }




}
