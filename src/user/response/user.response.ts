import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { GenderEnum } from "../schema/gender.enum";

export class UserResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiPropertyOptional({ enum: Object.values(GenderEnum) })
  gender: GenderEnum;

}
