import { Injectable } from '@nestjs/common';
import { ClientsService } from '../clients/clients.service';
import { WalletService } from '../wallet/wallet.service';
import { AuthService } from '../auth/auth.service';
import { MailService } from '../mail/mail.service';
import { CreateClientDto } from '../clients/dto/create-client.dto';
import { ErrorCodes, ErrorMessages } from '../../core/constants/error-codes';

@Injectable()
export class SoapService {
  constructor(
    private clientsService: ClientsService,
    private walletService: WalletService,
    private authService: AuthService,
    private mailService: MailService,
  ) {}

  async registerClient(clientData: CreateClientDto) {
    // Validaciones manuales
    if (!/^\d+$/.test(clientData.document)) {
      return {
        success: false,
        cod_error: ErrorCodes.VALIDATION_ERROR,
        message_error: 'El documento debe contener solo dígitos',
        data: null,
      };
    }
    if (!/^\d{10}$/.test(clientData.phone)) {
      return {
        success: false,
        cod_error: ErrorCodes.VALIDATION_ERROR,
        message_error: 'El teléfono debe tener 10 dígitos',
        data: null,
      };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.email)) {
      return {
        success: false,
        cod_error: ErrorCodes.VALIDATION_ERROR,
        message_error: 'El correo no es válido',
        data: null,
      };
    }
    const client = await this.clientsService.create(clientData);
    return {
      success: true,
      cod_error: ErrorCodes.SUCCESS,
      message_error: 'Client registered successfully',
      data: client,
    };
  }

  async rechargeWallet(document: string, phone: string, amount: number) {
    // Validaciones
    if (!/^\d+$/.test(document)) {
      return {
        success: false,
        cod_error: ErrorCodes.VALIDATION_ERROR,
        message_error: 'El documento debe contener solo dígitos',
        data: null,
      };
    }
    if (!/^\d{10}$/.test(phone)) {
      return {
        success: false,
        cod_error: ErrorCodes.VALIDATION_ERROR,
        message_error: 'El teléfono debe tener 10 dígitos',
        data: null,
      };
    }
    if (amount < 0) {
      return {
        success: false,
        cod_error: ErrorCodes.VALIDATION_ERROR,
        message_error: 'El monto de recarga no puede ser negativo',
        data: null,
      };
    }
    const client = await this.clientsService.validateClientCredentials(document, phone);
    const wallet = await this.walletService.recharge(client.id, amount);
    return {
      success: true,
      cod_error: ErrorCodes.SUCCESS,
      message_error: 'Wallet recharged successfully',
      data: { balance: wallet.balance },
    };
  }

  async initiatePayment(document: string, phone: string, amount: number) {
    // Validaciones
    if (!/^\d+$/.test(document)) {
      return {
        success: false,
        cod_error: ErrorCodes.VALIDATION_ERROR,
        message_error: 'El documento debe contener solo dígitos',
        data: null,
      };
    }
    if (!/^\d{10}$/.test(phone)) {
      return {
        success: false,
        cod_error: ErrorCodes.VALIDATION_ERROR,
        message_error: 'El teléfono debe tener 10 dígitos',
        data: null,
      };
    }
    if (amount < 0) {
      return {
        success: false,
        cod_error: ErrorCodes.VALIDATION_ERROR,
        message_error: 'El monto de pago no puede ser negativo',
        data: null,
      };
    }
    const client = await this.clientsService.validateClientCredentials(document, phone);
    const balance = await this.walletService.getBalance(client.id);
    
    if (balance < amount) {
      return {
        success: false,
        cod_error: ErrorCodes.INSUFFICIENT_FUNDS,
        message_error: 'Insufficient funds',
        data: null,
      };
    }

    const otp = this.authService.generateOTP();
    const sessionId = this.authService.createSession(otp);
    
    await this.mailService.sendOTP(client.email, otp);

    return {
      success: true,
      cod_error: ErrorCodes.SUCCESS,
      message_error: 'OTP sent successfully',
      data: { sessionId },
    };
  }

  async confirmPayment(sessionId: string, otp: string, document: string, phone: string, amount: number) {
    // Validaciones
    if (!/^\d+$/.test(document)) {
      return {
        success: false,
        cod_error: ErrorCodes.VALIDATION_ERROR,
        message_error: 'El documento debe contener solo dígitos',
        data: null,
      };
    }
    if (!/^\d{10}$/.test(phone)) {
      return {
        success: false,
        cod_error: ErrorCodes.VALIDATION_ERROR,
        message_error: 'El teléfono debe tener 10 dígitos',
        data: null,
      };
    }
    if (amount < 0) {
      return {
        success: false,
        cod_error: ErrorCodes.VALIDATION_ERROR,
        message_error: 'El monto de pago no puede ser negativo',
        data: null,
      };
    }
    const client = await this.clientsService.validateClientCredentials(document, phone);
    
    if (!this.authService.validateSession(sessionId, otp)) {
      return {
        success: false,
        cod_error: ErrorCodes.VALIDATION_ERROR,
        message_error: 'Invalid or expired OTP',
        data: null,
      };
    }

    const wallet = await this.walletService.debit(client.id, amount);

    return {
      success: true,
      cod_error: ErrorCodes.SUCCESS,
      message_error: 'Payment processed successfully',
      data: { balance: wallet.balance },
    };
  }

  async getBalance(document: string, phone: string) {
    // Validaciones
    if (!/^\d+$/.test(document)) {
      return {
        success: false,
        cod_error: ErrorCodes.VALIDATION_ERROR,
        message_error: 'El documento debe contener solo dígitos',
        data: null,
      };
    }
    if (!/^\d{10}$/.test(phone)) {
      return {
        success: false,
        cod_error: ErrorCodes.VALIDATION_ERROR,
        message_error: 'El teléfono debe tener 10 dígitos',
        data: null,
      };
    }
    const client = await this.clientsService.validateClientCredentials(document, phone);
    const balance = await this.walletService.getBalance(client.id);
    
    return {
      success: true,
      cod_error: ErrorCodes.SUCCESS,
      message_error: 'Balance retrieved successfully',
      data: { balance },
    };
  }
}