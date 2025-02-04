import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsService } from './clients.service';
import { Client } from '../../core/entities/client.entity';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client]),
    WalletModule,
  ],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}