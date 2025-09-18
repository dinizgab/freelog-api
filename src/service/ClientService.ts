import { ClientRepository } from '../repository/ClientRepository';

const clientRepository = new ClientRepository();

class ClientService {

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
        return await clientRepository.createClient(
            companyName, contactName, contactTitle,
            email, phone, address, isActive, freelancerId);
    }

    async getClientById(id: number) {
        return await clientRepository.getClientById(id);
    }

    async getAllClients(freelancerId: number) {
        return await clientRepository.getAllClients(freelancerId);
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

        return await clientRepository.updateClients(id, data);
    }

    async deleteClients(id: number) {
        return await clientRepository.deleteClients(id);
    }
}

export default new ClientService();
