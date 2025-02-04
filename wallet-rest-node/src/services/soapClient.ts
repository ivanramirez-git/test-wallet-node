import { createClientAsync } from 'soap';
import env from '../config/env';
import {
  RegisterClientRequest,
  RechargeWalletRequest,
  InitiatePaymentRequest,
  ConfirmPaymentRequest,
  GetBalanceRequest,
  ServiceResponse
} from '../types/wallet';

class SoapClient {
  private static instance: SoapClient;
  private client: any;

  private constructor() {}

  public static async getInstance(): Promise<SoapClient> {
    if (!SoapClient.instance) {
      SoapClient.instance = new SoapClient();
      await SoapClient.instance.initializeClient();
    }
    return SoapClient.instance;
  }

  private async initializeClient() {
    try {
      this.client = await createClientAsync(env.SOAP_URL);
      console.log('SOAP client initialized URL:', env.SOAP_URL);
    } catch (error) {
      console.error('Failed to initialize SOAP client:', error);
      throw error;
    }
  }

  async registerClient(data: RegisterClientRequest): Promise<ServiceResponse> {
    return new Promise((resolve, reject) => {
      this.client.registerClient(data, (err: any, result: ServiceResponse) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  async rechargeWallet(data: RechargeWalletRequest): Promise<ServiceResponse> {
    return new Promise((resolve, reject) => {
      this.client.rechargeWallet(data, (err: any, result: ServiceResponse) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  async initiatePayment(data: InitiatePaymentRequest): Promise<ServiceResponse> {
    return new Promise((resolve, reject) => {
      this.client.initiatePayment(data, (err: any, result: ServiceResponse) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  async confirmPayment(data: ConfirmPaymentRequest): Promise<ServiceResponse> {
    return new Promise((resolve, reject) => {
      this.client.confirmPayment(data, (err: any, result: ServiceResponse) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  async getBalance(data: GetBalanceRequest): Promise<ServiceResponse> {
    return new Promise((resolve, reject) => {
      this.client.getBalance(data, (err: any, result: ServiceResponse) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
}

export default SoapClient;