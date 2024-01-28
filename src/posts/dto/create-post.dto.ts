import { ApiProperty } from "@nestjs/swagger";
import * as Joi from "joi";

export class CreatePostDto {
  @ApiProperty({
    description: "The Post's title",
    example: "First Post",
  })
  title: string;
  @ApiProperty({
    description: "The Post's body",
    example: "Post body",
  })
  body: string;
}

export const  createPostDtoValidator=Joi.object<CreatePostDto>({
  title: Joi.string().required(),
  body: Joi.string().required(),
})