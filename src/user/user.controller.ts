import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException, Param,
  Patch,
  Post,
  Put,
  Req,
  UseFilters,
  UseGuards,
  UsePipes
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto, createUserDTOValidator } from "./dto/create-user.dto";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnprocessableEntityResponse,
  ApiConsumes,
} from "@nestjs/swagger";
import { swaggerConst } from "../constant/swagger.const";
import { JoiValidationPipe } from "../pipe/joi/joi-validation.pipe";
import { MongoExceptionFilter } from "../filter/MongoExceptionFilter";
import { JwtTokenResponse } from "../auth/response/jwt-token.response";
import { UpdateUserDto, updateUserDTOValidator } from "./dto/update-user.dto";
import { UserResponse } from "./response/user.response";
import { TokenGuard } from "../guard/token.guard";
import { AuthService } from "../auth/auth.service";
import { objectIdValidator } from "../common/dto/object-id.dto";


@ApiInternalServerErrorResponse(swaggerConst.apiResponse.internalServerError)
@Controller("blog/user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @ApiTags(swaggerConst.tag.user)
  @ApiNoContentResponse({
    description:
      "User successfully created",
  })
  @ApiUnprocessableEntityResponse(swaggerConst.apiResponse.unprocessableEntity)
  @ApiBadRequestResponse(swaggerConst.apiResponse.badRequest)
  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiConsumes("application/x-www-form-urlencoded")
  @UsePipes(new JoiValidationPipe(createUserDTOValidator))
  @UseFilters(MongoExceptionFilter)

  async createUser(@Body() dto: CreateUserDto) {
    await this.userService.create(dto);

  }

  @ApiTags(swaggerConst.tag.user)
  @ApiOkResponse({
    type: UserResponse,
    description:
      "User update successfully done, as a result will be updated user",
  })
  @ApiBearerAuth()
  @ApiUnprocessableEntityResponse(swaggerConst.apiResponse.unprocessableEntity)
  @ApiBadRequestResponse(swaggerConst.apiResponse.badRequest)
  @ApiNotFoundResponse(swaggerConst.apiResponse.notFound)
  @ApiForbiddenResponse(swaggerConst.apiResponse.forbidden)
  @HttpCode(HttpStatus.OK)
  @UseGuards(TokenGuard)
  @ApiConsumes("application/x-www-form-urlencoded")
  @UsePipes(new JoiValidationPipe(updateUserDTOValidator))
  
  @Patch('update')
  async updateUser(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    await this.userService.update(req.token.user.id, updateUserDto);
    return this.userService.getUserById(req.token.user.id);
  }

  @ApiTags(swaggerConst.tag.user)
  @ApiOkResponse({
    type: UserResponse,
    description: "Get current user",
  })
  @ApiBearerAuth()
  @ApiForbiddenResponse(swaggerConst.apiResponse.forbidden)
  @HttpCode(HttpStatus.OK)
  @UseGuards(TokenGuard)
  @Get('find')
  async currentUser(@Req() req): Promise<UserResponse> {
    const user = await this.userService.getUserById(req.token.user.id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  @ApiTags(swaggerConst.tag.user)
  @ApiNoContentResponse({
    description: "Delete current user",
  })
  @ApiBearerAuth()
  @ApiForbiddenResponse(swaggerConst.apiResponse.forbidden)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(TokenGuard)
  @Delete('delete')
  async deleteUser(@Req() req): Promise<void> {
    await this.userService.deleteUser(req.token.user.id);
    await this.authService.deleteUserTokens(req.token.user.id);
  }
}
