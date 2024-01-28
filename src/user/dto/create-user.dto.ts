import { ApiProperty } from "@nestjs/swagger";
import * as Joi from "joi";
import { joiPasswordStrength } from "../../pipe/joi/util/joi-custom-validator";
import { ApiModelPropertyOptional } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { GenderEnum } from "../schema/gender.enum";


export class CreateUserDto {
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

  @ApiProperty({
    description: "The User’s first name, max 50",
    example: "Grigor",
  })
  firstName: string;

  @ApiProperty({
    description: "The User’s last name, max 50",
    example: "Hovhannisyan",
  })
  lastName: string;

  @ApiModelPropertyOptional({
    required: false,
    description: "The User’s gender",
    example: GenderEnum.FEMALE,
    enum: Object.keys(GenderEnum),
  })
  gender: string;


}

export const createUserDTOValidator = Joi.object<CreateUserDto>({
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
  firstName: Joi.string().max(50).required(),
  lastName: Joi.string().max(50).required(),
  gender: Joi.string().valid(...Object.keys(GenderEnum)),

});
