import { NextFunction, Request, RequestHandler, Response } from 'express';
import { verifyToken } from "../util/auth";

export const authenticate: RequestHandler = (request: Request, response: Response, next: NextFunction) => {
  const token = request.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    response.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decoded = verifyToken(token);
    (request as any).user = decoded;
    next();
  } catch (err) {
    response.status(400).json({ message: 'Invalid token.' });
  }
};

export const authorizeUser: RequestHandler = (request: Request, response: Response, next: NextFunction) => {
  const id = parseInt(request.params.id);
  const token = request.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    response.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decoded = verifyToken(token);
    if (decoded.id == id) {
      (request as any).user = decoded;
      next();
    } else {
      throw new Error("User ID does not match credentials.");
    }
  } catch (err) {
    response.status(400).json({ message: 'Invalid token.' });
  }
};