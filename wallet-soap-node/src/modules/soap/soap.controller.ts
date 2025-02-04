import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import * as soap from 'soap';
import { join } from 'path';
import * as fs from 'fs'; // <-- Nueva importación
import { SoapService } from './soap.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

// Se elimina el decorador @Controller y la clase SoapController

export function registerSoapEndpoint(server: any, soapService: SoapService, configService: ConfigService) {
    const host = configService.get('HOST') || 'localhost';
    const port = configService.get('PORT') || '3000';

    // WSDL definido en línea (se omiten partes sin cambios)
    const wsdl = `<?xml version="1.0" encoding="UTF-8"?>
<definitions name="WalletService"
             targetNamespace="http://example.com/wallet-service"
             xmlns="http://schemas.xmlsoap.org/wsdl/"
             xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
             xmlns:tns="http://example.com/wallet-service"
             xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <documentation>
        Este WSDL define el servicio WalletService, proporcionando operaciones para el registro de clientes, recargas, inicio y confirmación de pagos, y consulta de saldo.
    </documentation>
    <types>
        <xsd:schema targetNamespace="http://example.com/wallet-service">
            <!-- Register Client -->
            <xsd:element name="RegisterClientRequest">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element name="document" type="xsd:string"/>
                        <xsd:element name="names" type="xsd:string"/>
                        <xsd:element name="email" type="xsd:string"/>
                        <xsd:element name="phone" type="xsd:string"/>
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
            
            <!-- Recharge Wallet -->
            <xsd:element name="RechargeWalletRequest">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element name="document" type="xsd:string"/>
                        <xsd:element name="phone" type="xsd:string"/>
                        <xsd:element name="amount" type="xsd:decimal"/>
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
            
            <!-- Initiate Payment -->
            <xsd:element name="InitiatePaymentRequest">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element name="document" type="xsd:string"/>
                        <xsd:element name="phone" type="xsd:string"/>
                        <xsd:element name="amount" type="xsd:decimal"/>
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
            
            <!-- Confirm Payment -->
            <xsd:element name="ConfirmPaymentRequest">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element name="sessionId" type="xsd:string"/>
                        <xsd:element name="otp" type="xsd:string"/>
                        <xsd:element name="document" type="xsd:string"/>
                        <xsd:element name="phone" type="xsd:string"/>
                        <xsd:element name="amount" type="xsd:decimal"/>
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
            
            <!-- Get Balance -->
            <xsd:element name="GetBalanceRequest">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element name="document" type="xsd:string"/>
                        <xsd:element name="phone" type="xsd:string"/>
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
            
            <!-- Standard Response -->
            <xsd:element name="ServiceResponse">
                <xsd:complexType>
                    <xsd:sequence>
                        <xsd:element name="success" type="xsd:boolean"/>
                        <xsd:element name="cod_error" type="xsd:string"/>
                        <xsd:element name="message_error" type="xsd:string"/>
                        <xsd:element name="data" type="xsd:anyType"/>
                    </xsd:sequence>
                </xsd:complexType>
            </xsd:element>
        </xsd:schema>
    </types>

    <message name="RegisterClientInput">
        <part name="parameters" element="tns:RegisterClientRequest"/>
    </message>
    <message name="RechargeWalletInput">
        <part name="parameters" element="tns:RechargeWalletRequest"/>
    </message>
    <message name="InitiatePaymentInput">
        <part name="parameters" element="tns:InitiatePaymentRequest"/>
    </message>
    <message name="ConfirmPaymentInput">
        <part name="parameters" element="tns:ConfirmPaymentRequest"/>
    </message>
    <message name="GetBalanceInput">
        <part name="parameters" element="tns:GetBalanceRequest"/>
    </message>
    <message name="ServiceOutput">
        <part name="parameters" element="tns:ServiceResponse"/>
    </message>

    <portType name="WalletServicePort">
        <operation name="registerClient">
            <documentation>Registra un nuevo cliente utilizando documento, nombres, email y teléfono.</documentation>
            <input message="tns:RegisterClientInput"/>
            <output message="tns:ServiceOutput"/>
        </operation>
        <operation name="rechargeWallet">
            <documentation>Recarga la billetera de un cliente especificado por documento y teléfono.</documentation>
            <input message="tns:RechargeWalletInput"/>
            <output message="tns:ServiceOutput"/>
        </operation>
        <operation name="initiatePayment">
            <documentation>Inicia un proceso de pago para el cliente.</documentation>
            <input message="tns:InitiatePaymentInput"/>
            <output message="tns:ServiceOutput"/>
        </operation>
        <operation name="confirmPayment">
            <documentation>Confirma un pago pendiente utilizando sesión, OTP, documento, teléfono y monto.</documentation>
            <input message="tns:ConfirmPaymentInput"/>
            <output message="tns:ServiceOutput"/>
        </operation>
        <operation name="getBalance">
            <documentation>Consulta el saldo disponible del cliente.</documentation>
            <input message="tns:GetBalanceInput"/>
            <output message="tns:ServiceOutput"/>
        </operation>
    </portType>

    <binding name="WalletServiceBinding" type="tns:WalletServicePort">
        <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
        <operation name="registerClient">
            <soap:operation soapAction="http://example.com/wallet-service/registerClient"/>
            <input>
                <soap:body use="literal"/>
            </input>
            <output>
                <soap:body use="literal"/>
            </output>
        </operation>
        <operation name="rechargeWallet">
            <soap:operation soapAction="http://example.com/wallet-service/rechargeWallet"/>
            <input>
                <soap:body use="literal"/>
            </input>
            <output>
                <soap:body use="literal"/>
            </output>
        </operation>
        <operation name="initiatePayment">
            <soap:operation soapAction="http://example.com/wallet-service/initiatePayment"/>
            <input>
                <soap:body use="literal"/>
            </input>
            <output>
                <soap:body use="literal"/>
            </output>
        </operation>
        <operation name="confirmPayment">
            <soap:operation soapAction="http://example.com/wallet-service/confirmPayment"/>
            <input>
                <soap:body use="literal"/>
            </input>
            <output>
                <soap:body use="literal"/>
            </output>
        </operation>
        <operation name="getBalance">
            <soap:operation soapAction="http://example.com/wallet-service/getBalance"/>
            <input>
                <soap:body use="literal"/>
            </input>
            <output>
                <soap:body use="literal"/>
            </output>
        </operation>
    </binding>

    <service name="WalletService">
        <port name="WalletServiceSoapPort" binding="tns:WalletServiceBinding">
            <soap:address location="http://${host}:${port}/soap"/>
        </port>
    </service>
</definitions>`;

    // Se utiliza el servidor http compartido en lugar de un puerto nuevo
    const soapServer = soap.listen(server, '/soap', {
        WalletService: {
            WalletServiceSoapPort: {
                registerClient: async (args: any) => soapService.registerClient(args),
                rechargeWallet: async (args: any) => soapService.rechargeWallet(args.document, args.phone, args.amount),
                initiatePayment: async (args: any) => soapService.initiatePayment(args.document, args.phone, args.amount),
                confirmPayment: async (args: any) => soapService.confirmPayment(args.sessionId, args.otp, args.document, args.phone, args.amount),
                getBalance: async (args: any) => soapService.getBalance(args.document, args.phone),
            },
        },
    }, wsdl, (err: any, res: any) => { /* callback opcional */ });

    // Middleware de autenticación configurado en el servidor SOAP
    soapServer.authenticate = (security: any) => {
        // const token = security.wsSecurity?.token;
        // if (!token) {
        // 	throw new Error('Authentication required');
        // }
        // Validar el JWT acá
        return true;
    };
}