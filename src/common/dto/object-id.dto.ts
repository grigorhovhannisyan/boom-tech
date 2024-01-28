import * as Joi from "joi";

export const objectIdValidator = Joi.string().hex().length(24).required();
