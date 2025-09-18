import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "defaultSecret";

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
}

export const generateToken = (id: number, email: string): string => {
  return jwt.sign(
    { id: id, email: email},
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
}
