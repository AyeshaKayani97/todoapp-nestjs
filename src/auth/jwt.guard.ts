import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);
        
        if (!token) {
            throw new UnauthorizedException('Authorization token not found');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });

            request.user = payload;

            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    private extractTokenFromHeader(req: Request): string | undefined {
        const authorizationHeader = req.headers.authorization;
        
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return undefined;
        }
        
        return authorizationHeader.split(' ')[1];
    }
}
