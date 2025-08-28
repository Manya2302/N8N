import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

export class AuthService {
  static async hashPassword(password) {
    return await argon2.hash(password);
  }

  static async verifyPassword(hashedPassword, plainPassword) {
    try {
      return await argon2.verify(hashedPassword, plainPassword);
    } catch (error) {
      return false;
    }
  }

  static generateAccessToken(user) {
    return jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  static generateRefreshToken() {
    return crypto.randomBytes(64).toString('hex');
  }

  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  static getRefreshTokenExpiry() {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); // 7 days
    return expiryDate;
  }

  static async hashRefreshToken(token) {
    return await argon2.hash(token);
  }

  static async verifyRefreshToken(hashedToken, plainToken) {
    try {
      return await argon2.verify(hashedToken, plainToken);
    } catch (error) {
      return false;
    }
  }
}

export function generateCSRFToken() {
  return crypto.randomBytes(32).toString('hex');
}
