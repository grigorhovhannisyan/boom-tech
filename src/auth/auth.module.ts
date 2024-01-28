import { forwardRef, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtToken, JwtTokenSchema } from "./schema/jwt-token.schema";
import { JwtModule } from "@nestjs/jwt";
import { jwtModuleAsyncOptions } from "../options/jwt/jwt-module-async.options";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JwtToken.name, schema: JwtTokenSchema },
    ]),
    JwtModule.registerAsync(jwtModuleAsyncOptions),
    ConfigModule,
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, ConfigService],
  exports: [AuthService],
})
export class AuthModule {}
