import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import * as Joi from "joi";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateCommentDto {
  @ApiProperty()
  post: string;
  @ApiProperty({
    description:"Post comment",
    example:"cool",
  })
  text: string;
}

export const updateCommentDtoValidator=Joi.object<UpdateCommentDto>({
  post:Joi.string().hex().length(24).required(),
  text:Joi.string()
})