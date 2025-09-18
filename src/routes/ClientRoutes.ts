import { Router } from 'express';
import ClientController from '../controller/ClientController';
import { authenticate, authorizeUser } from '../middleware/authMiddleware';

/**
 * @swagger
 * tags:
 *  name: Clientes
 *  description: Endpoints para CRUD de clientes
 */
const router = Router();

/**
 * @swagger
 * /clients:
 *  post:
 *    tags:
 *      - Clientes
 *    summary: Criar um novo cliente.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ClientPostRequest'
 *    responses:
 *      201:
 *        description: Cliente criado com sucesso.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ClientResponse'
 *      500:
 *        description: Erro ao criar cliente.
 */
router.post('/clients', authenticate, (request, response) => { ClientController.createClient(request, response); });

/**
 * @swagger
 * /clients/{id}:
 *  get:
 *    tags:
 *      - Clientes
 *    summary: Buscar cliente pelo ID.
 *    parameters:
 *      - name: id
 *        in: path
 *        description: ID do cliente
 *        required: true
 *        schema:
 *          type: integer
 *          format: int64
 *    responses:
 *      200:
 *        description: Cliente encontrado.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ClientResponse'
 *      404:
 *        description: Cliente não encontrado.
 *      500:
 *        description: Erro ao buscar cliente.
 */
router.get('/clients/:id', authenticate, (request, response) => { ClientController.getClientById(request, response); });

/**
 * @swagger
 * /clients:
 *  get:
 *    tags:
 *      - Clientes
 *    summary: Listar todos os clientes.
 *    responses:
 *      200:
 *        description: Lista de clientes.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/ClientResponse'
 *      500:
 *        description: Erro ao listar clientes.
 */
router.get('/clients', authenticate, (request, response) => { ClientController.getAllClients(request, response); });

/**
 * @swagger
 * /clients/{id}:
 *  put:
 *    tags:
 *      - Clientes
 *    summary: Atualizar cliente por ID.
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: ID do cliente
 *        schema:
 *          type: integer
 *          format: int64
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/ClientPutRequest'
 *    responses:
 *      200:
 *        description: Cliente atualizado.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ClientResponse'
 *      404:
 *        description: Cliente não encontrado.
 *      500:
 *        description: Erro ao atualizar cliente.
 */
router.put('/clients/:id', authenticate, authorizeUser, (request, response) => { ClientController.updateClient(request, response); });

/**
 * @swagger
 * /clients/{id}:
 *  delete:
 *    tags:
 *      - Clientes
 *    summary: Deletar cliente por ID.
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: ID do cliente
 *        schema:
 *          type: integer
 *          format: int64
 *    responses:
 *      204:
 *        description: Cliente removido.
 *      404:
 *        description: Cliente não encontrado.
 *      500:
 *        description: Erro ao remover cliente.
 */
router.delete('/clients/:id', authenticate, authorizeUser, (request, response) => { ClientController.deleteClient(request, response); });

export default router;
