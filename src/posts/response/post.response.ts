import { ApiProperty } from "@nestjs/swagger";
import { UserResponse } from "../../user/response/user.response";

export class PostResponse {
  @ApiProperty()
  id:string
  @ApiProperty()
  title: string;
  @ApiProperty()
  body:string;
  @ApiProperty({
    type:UserResponse
  })
  author:UserResponse
  @ApiProperty()
  createdAt:string
  @ApiProperty()
  updatedAt:string
}
