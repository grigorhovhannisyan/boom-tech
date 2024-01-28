import { ValidationErrorItem, Context } from "joi";
import { HttpException, HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class JoiUnprocessableEntityException extends HttpException {
  constructor(arg: JoiUnprocessableEntityExceptionArg[]) {
    super(arg, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

abstract class JoiUnprocessableEntityExceptionItemContext implements Context {
  @ApiProperty({ example: "email" })
  key?: string | undefined;

  @ApiProperty({ example: "email" })
  label?: string | undefined;

  @ApiProperty({ example: "marysmith@email" })
  value?: any;
}

export abstract class JoiUnprocessableEntityExceptionArg
  implements ValidationErrorItem
{
  @ApiProperty({ example: '"email" must be a valid email' })
  message: string;

  @ApiProperty({ example: "string.email" })
  type: string;

  @ApiProperty({ example: ["email"] })
  path: Array<string | number>;

  @ApiProperty()
  context?: JoiUnprocessableEntityExceptionItemContext;
}
