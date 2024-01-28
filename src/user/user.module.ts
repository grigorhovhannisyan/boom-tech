import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schema/user.schema";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "../auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { jwtModuleAsyncOptions } from "../options/jwt/jwt-module-async.options";


@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
     ]),
    JwtModule.registerAsync(jwtModuleAsyncOptions),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService, ConfigService],
  exports: [UserService],
})
export class UserModule {}
