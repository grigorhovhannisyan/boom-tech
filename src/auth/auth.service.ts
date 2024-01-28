import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtToken, JwtTokenDocument } from "./schema/jwt-token.schema";
import { FilterQuery, Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../user/schema/user.schema";
import { LoginDto } from "./dto/login.dto";
import {
  JWT_REFRESH_TOKEN_LIFE,
  JWT_SECRET_KEY,
} from "../constant/env-key.const";
import { JwtTokenResponse } from "./response/jwt-token.response";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(JwtToken.name) private jwtModel: Model<JwtTokenDocument>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async token(dto: LoginDto): Promise<JwtTokenResponse> {
    const user = await this.userService.getUserByUsername(dto.username);
    if (!bcrypt.compareSync(dto.password, user.password)) {
      throw new BadRequestException("The specified password is not valid.");
    }
    return this.saveTokens(user);
  }

  async refreshToken(dto: RefreshTokenDto): Promise<JwtTokenResponse> {
    const token = await this.jwtModel
      .findOne({ refreshToken: dto.refreshToken })
      .populate(User.name.toLowerCase());
    if (!token || !token.user) {
      throw new UnauthorizedException(
        `The token for ${dto.refreshToken} is not found`,
      );
    }
    await this.jwtService.verify(
      token.refreshToken,
      this.configService.get(JWT_SECRET_KEY),
    );
    await this.jwtModel.findOneAndRemove({ refreshToken: dto.refreshToken });
    return this.saveTokens(token.user);
  }

  async findToken(accessToken: string): Promise<JwtTokenResponse> {
    const token = await this.jwtModel
      .findOne({ accessToken })
      .populate(User.name.toLowerCase());
    if (!token || !token.user) {
      throw new UnauthorizedException(
        `The token for ${accessToken} is not found`,
      );
    }
    return token as JwtTokenResponse;
  }

  async saveTokens(user: User): Promise<JwtTokenResponse> {
    const accessToken = await this.jwtService.signAsync({ id: user.username });
    const refreshToken = await this.jwtService.signAsync(
      { user: user },
      {
        expiresIn: this.configService.get<number>(JWT_REFRESH_TOKEN_LIFE),
      },
    );
    const payload = {
      accessToken,
      refreshToken,
      user: user,
    };

    const createdToken = await this.jwtModel.create(payload);
    return createdToken as JwtTokenResponse;
  }

  async deleteUserTokens(userId: string): Promise<void> {
    const filter: FilterQuery<any> = { user: userId };
    await this.jwtModel.deleteMany(filter);
  }
}
