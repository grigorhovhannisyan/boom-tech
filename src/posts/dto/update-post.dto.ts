import { PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import * as Joi from "joi";

export class UpdatePostDto extends PartialType(CreatePostDto) {}
export const updatePostDtoValidator=Joi.object<UpdatePostDto>({
  title:Joi.string(),
  body:Joi.string()
})
