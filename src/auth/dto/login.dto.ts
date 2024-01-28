import { ApiProperty } from "@nestjs/swagger";
import * as Joi from "joi";
import { joiPasswordStrength } from "../../pipe/joi/util/joi-custom-validator";

export class LoginDto {
  @ApiProperty({
    description:
      "The User’s email address. Email address is unique and stored in lower case",
    example: "grigor.hovhannisyan@email.com",
    maxLength: 320,
  })
  username: string;

  @ApiProperty({
    description:
      "The User’s plain text password. Minimum eight characters, at least one letter and one number.",
    minLength: 8,
    maxLength: 32,
    example: "Admin123",
  })
  password: string;

}

export const loginDTOValidator = Joi.object<LoginDto>({
  username: Joi.string().email().max(320).required(),
  password: Joi.string()
    .min(8)
    .max(32)
    .pattern(/^((?! +).)*$/)
    .message(
      "Invalid password. Password should not include any space or new line character",
    )
    .custom(joiPasswordStrength)
    .message(
      "Insecure password. Password must include at least one letter and one number",
    )
    .required(),
});
