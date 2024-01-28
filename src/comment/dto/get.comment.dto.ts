import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import * as  Joi from "joi";

export class GetCommentDto {
  @ApiProperty()
  post: string;
  @ApiPropertyOptional({
    description: "Offset",
    default: 0
  })
  offset: number;
  @ApiPropertyOptional({
    description: "Limit",
    default: 20
  })
  limit: number;
  @ApiPropertyOptional({
    description: "Search by story title description"
  })
  text: string;
}

export const getCommentDtoValidator=Joi.object<GetCommentDto>({
  post:Joi.string().hex().length(24).required(),
  limit: Joi.number().min(1),
  offset: Joi.number().min(0),
  text: Joi.string(),
})