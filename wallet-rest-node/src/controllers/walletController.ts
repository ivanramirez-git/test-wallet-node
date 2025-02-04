import { Request, Response } from 'express';
import SoapClient from '../services/soapClient';
import { ErrorCodes, ErrorMessages } from '../config/errorCodes';

export default class WalletController {
  /**
   * @swagger
   * /api/wallet/register:
   *   post:
   *     summary: Register a new client
   *     tags: [Wallet]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - document
   *               - names
   *               - email
   *               - phone
   *             properties:
   *               document:
   *                 type: string
   *               names:
   *                 type: string
   *               email:
   *                 type: string
   *               phone:
   *                 type: string
   *     responses:
   *       200:
   *         description: Client registered successfully
   */
  static async registerClient(req: Request, res: Response) {
    // Validaciones para registro
    const { document, email, phone } = req.body;
    if (!/^\d+$/.test(document)) 
      return res.status(400).json({ 
        success: false, 
        cod_error: ErrorCodes.VALIDATION_ERROR, 
        message_error: 'El documento debe contener solo números', 
        data: null 
      });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) 
      return res.status(400).json({ 
        success: false, 
        cod_error: ErrorCodes.VALIDATION_ERROR, 
        message_error: 'Correo electrónico no es válido', 
        data: null 
      });
    if (!/^\d{10}$/.test(phone)) 
      return res.status(400).json({ 
        success: false, 
        cod_error: ErrorCodes.VALIDATION_ERROR, 
        message_error: 'El teléfono debe tener 10 dígitos', 
        data: null 
      });

    try {
      const soapClient = await SoapClient.getInstance();
      const result = await soapClient.registerClient(req.body);
      res.json({ 
        success: true, 
        cod_error: ErrorCodes.SUCCESS, 
        message_error: ErrorMessages[ErrorCodes.SUCCESS], 
        data: result 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        cod_error: ErrorCodes.DATABASE_ERROR, 
        message_error: 'Failed to register client', 
        data: null 
      });
    }
  }

  /**
   * @swagger
   * /api/wallet/recharge:
   *   post:
   *     summary: Recharge wallet
   *     tags: [Wallet]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - document
   *               - phone
   *               - amount
   *             properties:
   *               document:
   *                 type: string
   *               phone:
   *                 type: string
   *               amount:
   *                 type: number
   *     responses:
   *       200:
   *         description: Wallet recharged successfully
   */
  static async rechargeWallet(req: Request, res: Response) {
    // Validaciones para recarga
    const { document, phone, amount } = req.body;
    if (!/^\d+$/.test(document)) 
      return res.status(400).json({ 
        success: false, 
        cod_error: ErrorCodes.VALIDATION_ERROR, 
        message_error: 'El documento debe contener solo números', 
        data: null 
      });
    if (!/^\d{10}$/.test(phone)) 
      return res.status(400).json({ 
        success: false, 
        cod_error: ErrorCodes.VALIDATION_ERROR, 
        message_error: 'El teléfono debe tener 10 dígitos', 
        data: null 
      });
    if (amount < 0) 
      return res.status(400).json({ 
        success: false, 
        cod_error: ErrorCodes.VALIDATION_ERROR, 
        message_error: 'La recarga no puede ser negativa', 
        data: null 
      });

    try {
      const soapClient = await SoapClient.getInstance();
      const result = await soapClient.rechargeWallet(req.body);
      res.json({ 
        success: true, 
        cod_error: ErrorCodes.SUCCESS, 
        message_error: ErrorMessages[ErrorCodes.SUCCESS], 
        data: result 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        cod_error: ErrorCodes.DATABASE_ERROR, 
        message_error: 'Failed to recharge wallet', 
        data: null 
      });
    }
  }

  /**
   * @swagger
   * /api/wallet/payment/initiate:
   *   post:
   *     summary: Initiate a payment
   *     tags: [Wallet]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - document
   *               - phone
   *               - amount
   *             properties:
   *               document:
   *                 type: string
   *               phone:
   *                 type: string
   *               amount:
   *                 type: number
   *     responses:
   *       200:
   *         description: Payment initiated successfully
   */
  static async initiatePayment(req: Request, res: Response) {
    // Validaciones para iniciar pago
    const { document, phone, amount } = req.body;
    if (!/^\d+$/.test(document)) 
      return res.status(400).json({ 
        success: false, 
        cod_error: ErrorCodes.VALIDATION_ERROR, 
        message_error: 'El documento debe contener solo números', 
        data: null 
      });
    if (!/^\d{10}$/.test(phone)) 
      return res.status(400).json({ 
        success: false, 
        cod_error: ErrorCodes.VALIDATION_ERROR, 
        message_error: 'El teléfono debe tener 10 dígitos', 
        data: null 
      });
    if (amount < 0) 
      return res.status(400).json({ 
        success: false, 
        cod_error: ErrorCodes.VALIDATION_ERROR, 
        message_error: 'El pago no puede ser negativo', 
        data: null 
      });

    try {
      const soapClient = await SoapClient.getInstance();
      const result = await soapClient.initiatePayment(req.body);
      res.json({ 
        success: true, 
        cod_error: ErrorCodes.SUCCESS, 
        message_error: ErrorMessages[ErrorCodes.SUCCESS], 
        data: result 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        cod_error: ErrorCodes.DATABASE_ERROR, 
        message_error: 'Failed to initiate payment', 
        data: null 
      });
    }
  }

  /**
   * @swagger
   * /api/wallet/payment/confirm:
   *   post:
   *     summary: Confirm a payment
   *     tags: [Wallet]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - sessionId
   *               - otp
   *               - document
   *               - phone
   *               - amount
   *             properties:
   *               sessionId:
   *                 type: string
   *               otp:
   *                 type: string
   *               document:
   *                 type: string
   *               phone:
   *                 type: string
   *               amount:
   *                 type: number
   *     responses:
   *       200:
   *         description: Payment confirmed successfully
   */
  static async confirmPayment(req: Request, res: Response) {
    // Validaciones para confirmar pago
    const { document, phone, amount } = req.body;
    if (!/^\d+$/.test(document)) 
      return res.status(400).json({ 
        success: false, 
        cod_error: ErrorCodes.VALIDATION_ERROR, 
        message_error: 'El documento debe contener solo números', 
        data: null 
      });
    if (!/^\d{10}$/.test(phone)) 
      return res.status(400).json({ 
        success: false, 
        cod_error: ErrorCodes.VALIDATION_ERROR, 
        message_error: 'El teléfono debe tener 10 dígitos', 
        data: null 
      });
    if (amount < 0) 
      return res.status(400).json({ 
        success: false, 
        cod_error: ErrorCodes.VALIDATION_ERROR, 
        message_error: 'El monto no puede ser negativo', 
        data: null 
      });

    try {
      const soapClient = await SoapClient.getInstance();
      const result = await soapClient.confirmPayment(req.body);
      res.json({ 
        success: true, 
        cod_error: ErrorCodes.SUCCESS, 
        message_error: ErrorMessages[ErrorCodes.SUCCESS], 
        data: result 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        cod_error: ErrorCodes.DATABASE_ERROR, 
        message_error: 'Failed to confirm payment', 
        data: null 
      });
    }
  }

  /**
   * @swagger
   * /api/wallet/balance:
   *   post:
   *     summary: Get wallet balance
   *     tags: [Wallet]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - document
   *               - phone
   *             properties:
   *               document:
   *                 type: string
   *               phone:
   *                 type: string
   *     responses:
   *       200:
   *         description: Balance retrieved successfully
   */
  static async getBalance(req: Request, res: Response) {
    // Validaciones para consultar balance
    const { document, phone } = req.body;
    if (!/^\d+$/.test(document)) 
      return res.status(400).json({ 
        success: false, 
        cod_error: ErrorCodes.VALIDATION_ERROR, 
        message_error: 'El documento debe contener solo números', 
        data: null 
      });
    if (!/^\d{10}$/.test(phone)) 
      return res.status(400).json({ 
        success: false, 
        cod_error: ErrorCodes.VALIDATION_ERROR, 
        message_error: 'El teléfono debe tener 10 dígitos', 
        data: null 
      });

    try {
      const soapClient = await SoapClient.getInstance();
      const result = await soapClient.getBalance(req.body);
      res.json({ 
        success: true, 
        cod_error: ErrorCodes.SUCCESS, 
        message_error: ErrorMessages[ErrorCodes.SUCCESS], 
        data: result 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        cod_error: ErrorCodes.DATABASE_ERROR, 
        message_error: 'Failed to get balance', 
        data: null 
      });
    }
  }
}