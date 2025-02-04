import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ErrorCodes, ErrorMessages } from '../../../core/constants/error-codes';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private jwtService: JwtService) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException({
                cod_error: ErrorCodes.UNAUTHORIZED,
                message_error: ErrorMessages[ErrorCodes.UNAUTHORIZED],
            });
        }

        try {
            const payload = this.jwtService.verify(token);
            request['user'] = payload;
            return true;
        } catch {
            throw new UnauthorizedException({
                cod_error: ErrorCodes.INVALID_TOKEN,
                message_error: ErrorMessages[ErrorCodes.INVALID_TOKEN],
            });
        }
    }

    private extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}