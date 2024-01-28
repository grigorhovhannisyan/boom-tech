import { ApiProperty } from "@nestjs/swagger";
import * as Joi from "joi";

export class RefreshTokenDto {
  @ApiProperty({
    description: "The refresh token",
  })
  refreshToken: string;

}

export const refreshTokenDtoValidator = Joi.object<RefreshTokenDto>({
  refreshToken: Joi.string().required(),
});
