import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export class JwtTokenService {
  generateAccessToken(payload) {
    if (!env.jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign(payload, env.jwtSecret, {
      expiresIn: env.jwtExpiration,
    });
  }

  generateRefreshToken(payload) {
    const secret = env.jwtRefreshSecret || env.jwtSecret;
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET or JWT_SECRET must be defined');
    }
    return jwt.sign(payload, secret, {
      expiresIn: env.jwtRefreshExpiration,
    });
  }
}
