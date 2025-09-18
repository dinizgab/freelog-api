import { Request, Response } from "express";
import { comparePassword, generateToken } from "../util/auth";
import { findUserByEmail } from "../model/User";

export const login = async (request: Request, response: Response) => {

  const { email, password } = request.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return response.status(400).json({ message: "E-mail ou senha inválidos." });
    }
    
    const isPasswordValid = comparePassword(password, user.password);
    if (!isPasswordValid) {
      return response.status(400).json({ message: "E-mail ou senha inválidos." });
    }

    const token = generateToken(user.id, user.email);
    response.status(200).json({
      message: "Login bem-sucedido.",
      token: token,
      loggedUser: user
    });
  } catch (error) {
    response.status(500).json({ message: "Erro ao fazer login.", error: error });
  }

};
