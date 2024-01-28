import { ApiPropertyOptional } from "@nestjs/swagger";
import * as Joi from "joi";
import { ApiModelPropertyOptional } from "@nestjs/swagger/dist/decorators/api-model-property.decorator";
import { GenderEnum } from "../schema/gender.enum";


export class UpdateUserDto {
  @ApiPropertyOptional({
    description: "The User’s first name, max 50",
    example: "Grigor",
  })
  firstName?: string;

  @ApiPropertyOptional({
    description: "The User’s last name, max 50",
    example: "Hovhannisyan",
  })
  lastName?: string;


  @ApiModelPropertyOptional({
    description: "The User’s gender",
    example: GenderEnum.FEMALE,
    enum: Object.keys(GenderEnum),
  })
  gender?: string;

}

export const updateUserDTOValidator = Joi.object<UpdateUserDto>({
  firstName: Joi.string().max(50),
  lastName: Joi.string().max(50),
  gender: Joi.string().valid(...Object.keys(GenderEnum)),

});
