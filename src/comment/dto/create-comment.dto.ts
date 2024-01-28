import { ApiProperty } from "@nestjs/swagger";
import * as Joi from "joi";

export class CreateCommentDto {
  @ApiProperty()
  post: string;
  @ApiProperty({
    description:"Post comment",
    example:"cool",
  })
  text: string;
}

export const createCommentDtoValidator=Joi.object<CreateCommentDto>({
  post:Joi.string().hex().length(24).required(),
  text:Joi.string()
})