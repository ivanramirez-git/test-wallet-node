import { Module } from '@nestjs/common';
// import { SoapController } from './soap.controller';
import { SoapService } from './soap.service';
import { SoapClient } from './soap.client';
import { ClientsModule } from '../clients/clients.module';
import { WalletModule } from '../wallet/wallet.module';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';

@Module({
    imports: [
        ClientsModule,
        WalletModule,
        AuthModule,
        MailModule,
    ],
    controllers: [],
    providers: [SoapService, SoapClient],
    exports: [SoapClient],
})
export class SoapModule { }