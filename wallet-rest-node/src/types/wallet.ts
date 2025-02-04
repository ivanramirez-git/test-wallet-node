export interface RegisterClientRequest {
  document: string;
  names: string;
  email: string;
  phone: string;
}

export interface RechargeWalletRequest {
  document: string;
  phone: string;
  amount: number;
}

export interface InitiatePaymentRequest {
  document: string;
  phone: string;
  amount: number;
}

export interface ConfirmPaymentRequest {
  sessionId: string;
  otp: string;
  document: string;
  phone: string;
  amount: number;
}

export interface GetBalanceRequest {
  document: string;
  phone: string;
}

export interface ServiceResponse {
  success: boolean;
  cod_error: string;
  message_error: string;
  data: any;
}