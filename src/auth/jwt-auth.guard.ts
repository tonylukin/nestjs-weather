import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { SKIP_AUTH_KEY } from './skip-auth-guard.decorator';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private jwtStrategy: JwtStrategy,
    private reflector: Reflector,
    private configService: ConfigService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const skipAuthGuard = this.reflector.get<boolean>(
      SKIP_AUTH_KEY,
      context.getHandler(),
    );

    // If skipAuthGuard metadata is set to true, skip the guard
    if (skipAuthGuard) {
      return true;
    }

    // Otherwise, apply the usual guard logic (e.g., checking authentication)
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = await this.jwtStrategy.validate(payload);
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
    return true;
  }
}
