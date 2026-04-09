import { JwtPayload } from "jsonwebtoken";

export interface CustomJwtPayload extends JwtPayload {
    userId: string;
    role: string;
    displayName?: string;
    picUrl?: string;
}