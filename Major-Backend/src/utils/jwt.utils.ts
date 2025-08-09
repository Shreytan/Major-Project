import jwt, { SignOptions } from 'jsonwebtoken';
import { IJWTPayload } from '@/types/api.types';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export class JWTUtils {
  static generateToken(payload: Omit<IJWTPayload, 'iat' | 'exp'>): string {
    const options: SignOptions = {
      expiresIn: JWT_EXPIRES_IN as SignOptions['expiresIn']
    };
    return jwt.sign(payload, JWT_SECRET, options);
  }

  static verifyToken(token: string): IJWTPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as IJWTPayload;
    } catch {
      throw new Error('Invalid or expired token');
    }
  }

  static decodeToken(token: string): IJWTPayload | null {
    try {
      return jwt.decode(token) as IJWTPayload;
    } catch {
      return null;
    }
  }

  static isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    return decoded.exp < Math.floor(Date.now() / 1000);
  }

  static getTokenExpirationDate(token: string): Date | null {
    const decoded = this.decodeToken(token);
    return decoded?.exp ? new Date(decoded.exp * 1000) : null;
  }
}
