import { ApiPropertyOptional } from "@nestjs/swagger";
import * as Joi from "joi";

export class GetPostsDto{
  @ApiPropertyOptional({
    description: "Offset",
    default: 0,
  })
  offset: number;
  @ApiPropertyOptional({
    description: "Limit",
    default: 20,
  })
  limit: number;
  @ApiPropertyOptional({
    description: "Search by story title description",
  })
  text: string;
}
export const getPostsDtoValidator=Joi.object<GetPostsDto>({
  limit: Joi.number().min(1),
  offset: Joi.number().min(0),
  text: Joi.string(),
})