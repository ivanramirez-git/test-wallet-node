import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {

    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: this.configService.get('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  // Nuevo método para validar conexión al SMTP
  async testConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('Error al conectar con el servidor de correo:', error);
          return reject(error);
        }
        console.log('Connected to SMTP server:', success);
        resolve();
      });
    });
  }

  async sendOTP(email: string, otp: string): Promise<void> {
    // Envío asíncrono sin bloqueo de la respuesta
    this.transporter.sendMail({
      from: this.configService.get('SMTP_FROM'),
      to: email,
      subject: 'Your Payment Confirmation Code',
      html: `
        <h1>Payment Confirmation Code</h1>
        <p>Your confirmation code is: <strong>${otp}</strong></p>
        <p>This code will expire in ${this.configService.get('OTP_EXPIRATION')} minutes.</p>
      `,
    })
      .then(() => {
        console.log('Email sent successfully to', email);
      })
      .catch((error) => {
        console.error(`Error sending email to ${email}:`, error);
      });
  }
}