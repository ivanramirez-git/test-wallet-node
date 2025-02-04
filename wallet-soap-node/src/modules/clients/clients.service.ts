import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../core/entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { WalletService } from '../wallet/wallet.service';
import { ConfigService } from '@nestjs/config';
import { ErrorCodes, ErrorMessages } from '../../core/constants/error-codes';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    private walletService: WalletService,
    private configService: ConfigService,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const existingClient = await this.clientRepository.findOne({
      where: [
        { document: createClientDto.document },
        { email: createClientDto.email },
        { phone: createClientDto.phone },
      ],
    });

    if (existingClient) {
      throw new ConflictException({
        cod_error: ErrorCodes.USER_EXISTS,
        message_error: ErrorMessages[ErrorCodes.USER_EXISTS],
      });
    }

    const client = this.clientRepository.create(createClientDto);
    const savedClient = await this.clientRepository.save(client);

    const initialBalance = Number(this.configService.get('INITIAL_BALANCE'));
    await this.walletService.create(savedClient.id, initialBalance);

    return savedClient;
  }

  async findByDocument(document: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { document },
    });

    if (!client) {
      throw new NotFoundException({
        cod_error: ErrorCodes.USER_NOT_FOUND,
        message_error: ErrorMessages[ErrorCodes.USER_NOT_FOUND],
      });
    }

    return client;
  }

  async validateClientCredentials(document: string, phone: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { document, phone },
    });

    if (!client) {
      throw new NotFoundException({
        cod_error: ErrorCodes.USER_NOT_FOUND,
        message_error: ErrorMessages[ErrorCodes.USER_NOT_FOUND],
      });
    }

    return client;
  }
}