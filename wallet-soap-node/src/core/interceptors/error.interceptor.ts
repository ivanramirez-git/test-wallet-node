import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorCodes, ErrorMessages } from '../constants/error-codes';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        cod_error: ErrorCodes.SUCCESS,
        message_error: ErrorMessages[ErrorCodes.SUCCESS],
        data,
      })),
      catchError(error => {
        let cod_error = ErrorCodes.DATABASE_ERROR;
        let message_error = error.message;
        let status = HttpStatus.INTERNAL_SERVER_ERROR;

        if (error instanceof HttpException) {
          status = error.getStatus();
          const response: any = error.getResponse();
          cod_error = response.cod_error || ErrorCodes.VALIDATION_ERROR;
          message_error = response.message || response.message_error || error.message;
        }

        return throwError(() => new HttpException({
          success: false,
          cod_error,
          message_error,
          data: null,
        }, status));
      }),
    );
  }
}