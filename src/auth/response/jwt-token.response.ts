
import { ApiProperty } from "@nestjs/swagger";

export class User {
  @ApiProperty()
  id: string;
  @ApiProperty()
  username: string;

}

export class JwtTokenResponse {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
  @ApiProperty({ type:User })
  user: User;
}
