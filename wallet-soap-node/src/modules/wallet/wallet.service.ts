import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet } from '../../core/entities/wallet.entity';
import { Transaction, TransactionDocument } from '../../core/schemas/transaction.schema';
import { ErrorCodes, ErrorMessages } from '../../core/constants/error-codes';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    private configService: ConfigService,
  ) {}

  async create(clientId: string, initialBalance: number): Promise<Wallet> {
    const wallet = this.walletRepository.create({
      clientId,
      balance: initialBalance,
    });

    const savedWallet = await this.walletRepository.save(wallet);

    await this.createTransaction(savedWallet.id, 'CREDIT', initialBalance, 0, initialBalance, 'Initial balance');

    return savedWallet;
  }

  async recharge(clientId: string, amount: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: { clientId },
    });

    if (!wallet) {
      throw new NotFoundException({
        cod_error: ErrorCodes.USER_NOT_FOUND,
        message_error: ErrorMessages[ErrorCodes.USER_NOT_FOUND],
      });
    }

    const previousBalance = wallet.balance;
    // Convert the amount to double and balance to double
    const amountDouble = parseFloat(amount.toString());
    wallet.balance = parseFloat(wallet.balance.toString());
    wallet.balance += amountDouble;

    const updatedWallet = await this.walletRepository.save(wallet);

    await this.createTransaction(
      wallet.id,
      'CREDIT',
      amount,
      previousBalance,
      updatedWallet.balance,
      'Wallet recharge',
    );

    return updatedWallet;
  }

  async debit(clientId: string, amount: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: { clientId },
    });

    if (!wallet) {
      throw new NotFoundException({
        cod_error: ErrorCodes.USER_NOT_FOUND,
        message_error: ErrorMessages[ErrorCodes.USER_NOT_FOUND],
      });
    }

    if (wallet.balance < amount) {
      throw new BadRequestException({
        cod_error: ErrorCodes.INSUFFICIENT_FUNDS,
        message_error: ErrorMessages[ErrorCodes.INSUFFICIENT_FUNDS],
      });
    }

    const previousBalance = wallet.balance;
    wallet.balance -= amount;

    const updatedWallet = await this.walletRepository.save(wallet);

    await this.createTransaction(
      wallet.id,
      'DEBIT',
      amount,
      previousBalance,
      updatedWallet.balance,
      'Payment',
    );

    return updatedWallet;
  }

  async getBalance(clientId: string): Promise<number> {
    const wallet = await this.walletRepository.findOne({
      where: { clientId },
    });

    if (!wallet) {
      throw new NotFoundException({
        cod_error: ErrorCodes.USER_NOT_FOUND,
        message_error: ErrorMessages[ErrorCodes.USER_NOT_FOUND],
      });
    }

    return wallet.balance;
  }

  private async createTransaction(
    walletId: string,
    type: 'CREDIT' | 'DEBIT',
    amount: number,
    previousBalance: number,
    currentBalance: number,
    description: string,
  ): Promise<Transaction> {
    const transaction = new this.transactionModel({
      walletId,
      type,
      amount,
      previousBalance,
      currentBalance,
      description,
    });

    return transaction.save();
  }
}