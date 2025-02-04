import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true })
  walletId: string;

  @Prop({ required: true })
  type: 'CREDIT' | 'DEBIT';

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  previousBalance: number;

  @Prop({ required: true })
  currentBalance: number;

  @Prop()
  description: string;

  @Prop()
  reference: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);