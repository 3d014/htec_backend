import { Request as ExpressRequest } from "express";
export interface AuthUser {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}
export interface Request extends ExpressRequest {
  user?: AuthUser;
}
