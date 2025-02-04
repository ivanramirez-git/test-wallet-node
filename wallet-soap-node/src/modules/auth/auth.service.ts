import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private sessions: Map<string, { otp: string; expires: Date }> = new Map();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  createSession(otp: string): string {
    const sessionId = uuidv4();
    const expirationMinutes = this.configService.get<number>('OTP_EXPIRATION', 5);
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + expirationMinutes);

    this.sessions.set(sessionId, { otp, expires });
    return sessionId;
  }

  validateSession(sessionId: string, otp: string): boolean {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return false;
    }

    if (new Date() > session.expires) {
      this.sessions.delete(sessionId);
      return false;
    }

    if (session.otp !== otp) {
      return false;
    }

    this.sessions.delete(sessionId);

    return true;
  }

  generateToken(payload: any): string {
    return this.jwtService.sign(payload);
  }
}