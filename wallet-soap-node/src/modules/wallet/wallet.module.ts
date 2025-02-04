import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletService } from './wallet.service';
import { Wallet } from '../../core/entities/wallet.entity';
import { Transaction, TransactionSchema } from '../../core/schemas/transaction.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}