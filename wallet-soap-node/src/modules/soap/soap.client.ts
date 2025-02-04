import { Injectable } from '@nestjs/common';
import * as soap from 'soap';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SoapClient {
    private client: soap.Client;
    private readonly wsdlUrl = 'http://localhost:3000/soap?wsdl';

    constructor(private jwtService: JwtService) { }

    async connect() {
        if (!this.client) {
            this.client = await soap.createClientAsync(this.wsdlUrl);
            // Add security header
            const token = this.jwtService.sign({ clientId: 'test' });
            this.client.addSoapHeader({
                'wsSecurity': {
                    'token': token
                }
            });
        }
        return this.client;
    }

    async registerClient(data: any) {
        const client = await this.connect();
        return client.registerClientAsync(data);
    }

    async rechargeWallet(data: any) {
        const client = await this.connect();
        return client.rechargeWalletAsync(data);
    }

    async initiatePayment(data: any) {
        const client = await this.connect();
        return client.initiatePaymentAsync(data);
    }

    async confirmPayment(data: any) {
        const client = await this.connect();
        return client.confirmPaymentAsync(data);
    }

    async getBalance(data: any) {
        const client = await this.connect();
        return client.getBalanceAsync(data);
    }
}