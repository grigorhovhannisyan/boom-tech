import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../auth/auth.service";
import { ACCESS_TOKEN_KEY } from "../constant/header.const";

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const headerToken = request.headers[ACCESS_TOKEN_KEY];
    if (!headerToken) {
      throw new UnauthorizedException(`undefined header ${ACCESS_TOKEN_KEY}`);
    }

    const accessToken = headerToken.split(" ")[1];
    const token = await this.authService.findToken(accessToken);
    if (!token) {
      throw new UnauthorizedException(`Token not found`);
    }

    const isValid = await this.jwtService
      .verifyAsync(accessToken)
      .catch((error) => {
        throw new UnauthorizedException(
          error.message || `malformed ${ACCESS_TOKEN_KEY}`,
        );
      });
    if (!isValid) {
      throw new UnauthorizedException(`Invalid access token`);
    }

    request.token = token;
    return true;
  }
}
