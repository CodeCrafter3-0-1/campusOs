import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthPayload {
  studentId: string;
  email: string;
}

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as AuthPayload;
}
