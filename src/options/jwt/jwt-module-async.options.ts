import { ConfigModule, ConfigService } from "@nestjs/config";
import {
  JWT_ACCESS_TOKEN_LIFE,
  JWT_SECRET_KEY,
} from "../../constant/env-key.const";
import { JwtModuleAsyncOptions } from "@nestjs/jwt/dist/interfaces/jwt-module-options.interface";

export const jwtModuleAsyncOptions: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    secret: config.get(JWT_SECRET_KEY),
    signOptions: { expiresIn: config.get<number>(JWT_ACCESS_TOKEN_LIFE) },
  }),
};
