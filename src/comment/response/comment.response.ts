import { ApiProperty } from "@nestjs/swagger";
import { UserResponse } from "../../user/response/user.response";

export class CommentResponse {
  @ApiProperty()
  post: string;
  @ApiProperty()
  text: string;
  @ApiProperty({
    type: UserResponse
  })
  author: UserResponse;
  @ApiProperty()
  createdAt: string;
  @ApiProperty()
  updatedAt: string;
}