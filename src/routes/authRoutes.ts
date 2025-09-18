import express from "express";
import { login } from "../controller/authController";
import { asyncHandler } from "../util/asyncHandler";

/**
 * @swagger
 * tags:
 *  name: Login
 *  description: Endpoint para login
*/
const router = express.Router();

/**
 * @swagger
 * /login:
 *  post:
 *    tags:
 *      - Login
 *    summary: Realizar login.
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Login'
 *      required: true
 *    responses:
 *      200:
 *        description: Login bem-sucedido.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LoginResponse'
 *      400:
 *        description: Dados inválidos.
*/
router.post("/login", asyncHandler(login));

export default router;