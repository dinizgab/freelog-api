import { Request, Response } from 'express';
import ClientService from '../service/ClientService';

class ClientController {

    async createClient(request: Request, response: Response): Promise<Response> {
        try {
            const { companyName, contactName, contactTitle, email, phone, address, isActive, freelancerId } = request.body;
            const result = await ClientService.createClient(companyName, contactName, contactTitle, email, phone, address, isActive, freelancerId);
            return response.status(201).json(result);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: 'Erro ao criar cliente' });
        }
    }

    async getClientById(request: Request, response: Response): Promise<Response> {
        try {
            const client = await ClientService.getClientById(parseInt(request.params.id));
            return !client
                ? response.status(404).json({ error: 'Cliente não encontrado' })
                : response.status(200).json(client);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: 'Erro ao buscar cliente' })
        }
    }

    async getAllClients(request: Request, response: Response): Promise<Response> {
        try {
            const freelancerId = Number(request.query.freelancerId)
            const users = await ClientService.getAllClients(freelancerId);
            return response.status(200).json(users);
        } catch (error) {
            return response.status(500).json({ error: 'Erro ao listar clientes' });
        }
    }

    async updateClient(request: Request, response: Response): Promise<Response> {
        try {
            const user = await ClientService.updateClients(parseInt(request.params.id), request.body);
            return !user
                ? response.status(404).json({ error: 'Cliente não encontrado' })
                : response.status(200).json(user);
        } catch (error) {
            return response.status(500).json({ error: 'Erro ao atualizar cliente' });
        }
    }

    async deleteClient(request: Request, response: Response): Promise<Response> {
        try {
            const success = await ClientService.deleteClients(parseInt(request.params.id));
            return !success
                ? response.status(404).json({ error: 'Cliente não encontrado' })
                : response.status(204).send();
        } catch (error) {
            return response.status(500).json({ error: 'Erro ao excluir cliente' });
        }
    }
}

export default new ClientController();
