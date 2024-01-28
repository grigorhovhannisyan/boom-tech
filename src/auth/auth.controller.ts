import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import { swaggerConst } from "../constant/swagger.const";
import { JwtTokenResponse } from "./response/jwt-token.response";
import { AuthService } from "./auth.service";
import { LoginDto, loginDTOValidator } from "./dto/login.dto";
import { JoiValidationPipe } from "../pipe/joi/joi-validation.pipe";
import {
  RefreshTokenDto,
  refreshTokenDtoValidator,
} from "./dto/refresh-token.dto";
import { UserService } from "../user/user.service";

@ApiInternalServerErrorResponse(swaggerConst.apiResponse.internalServerError)
@Controller("blog/auth/jwt")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiTags(swaggerConst.tag.auth)
  @ApiOkResponse({
    description: "User authenticated",
    type: JwtTokenResponse,
  })
  @ApiUnprocessableEntityResponse(swaggerConst.apiResponse.unprocessableEntity)
  @ApiBadRequestResponse(swaggerConst.apiResponse.badRequest)
  @ApiNotFoundResponse(swaggerConst.apiResponse.notFound)
  @Post("token")
  @HttpCode(HttpStatus.OK)
  @ApiConsumes("application/x-www-form-urlencoded")
  @UsePipes(new JoiValidationPipe(loginDTOValidator))
  async token(@Body() dto: LoginDto): Promise<JwtTokenResponse> {
    const token = await this.authService.token(dto);
    const user = await this.userService.getUserById(token.user.id);
    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      user: user,
    };
  }

  @ApiTags(swaggerConst.tag.auth)
  @ApiOkResponse({
    description: "The tokens refreshed",
    type: JwtTokenResponse,
  })
  @ApiUnprocessableEntityResponse(swaggerConst.apiResponse.unprocessableEntity)
  @ApiBadRequestResponse(swaggerConst.apiResponse.badRequest)
  @ApiNotFoundResponse(swaggerConst.apiResponse.notFound)
  @Post("refresh-token")
  @HttpCode(HttpStatus.OK)
  @ApiConsumes("application/x-www-form-urlencoded")
  @UsePipes(new JoiValidationPipe(refreshTokenDtoValidator))
  async refreshToken(@Body() dto: RefreshTokenDto): Promise<JwtTokenResponse> {
    const token = await this.authService.refreshToken(dto);
    const user = await this.userService.getUserById(token.user.id);
    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      user: user,
    };
  }


}
