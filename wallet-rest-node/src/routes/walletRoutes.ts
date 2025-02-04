import { Router } from 'express';
import WalletController from '../controllers/walletController';

const router = Router();

router.post('/register', WalletController.registerClient);
router.post('/recharge', WalletController.rechargeWallet);
router.post('/payment/initiate', WalletController.initiatePayment);
router.post('/payment/confirm', WalletController.confirmPayment);
router.post('/balance', WalletController.getBalance);

export default router;