import { Injectable, PipeTransform } from "@nestjs/common";
import Joi from "joi";
import { JoiUnprocessableEntityException } from "./joi-unprocessable-entity.exception";

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: Joi.Schema) {}

  transform(value: any) {
    const { error } = this.schema.validate(value, {
      abortEarly: false,
      allowUnknown: false,
    });

    if (error) {
      throw new JoiUnprocessableEntityException(error.details);
    }

    return value;
  }
}
