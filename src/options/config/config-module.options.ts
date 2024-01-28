import * as Joi from "joi";
import { ConfigModuleOptions } from "@nestjs/config";
import {
  JWT_ACCESS_TOKEN_LIFE,
  JWT_REFRESH_TOKEN_LIFE,
  JWT_SECRET_KEY,
  MONGODB_URI,
  NODE_ENV,
  PORT,
} from "../../constant/env-key.const";

export const configModuleOptions: ConfigModuleOptions = {
  validationSchema: Joi.object({
    [NODE_ENV]: Joi.string()
      .valid("development", "production", "test")
      .default("development"),
    [PORT]: Joi.number().default(3000),
    [MONGODB_URI]: Joi.string().required(),
    [JWT_SECRET_KEY]: Joi.string().required(),
    [JWT_ACCESS_TOKEN_LIFE]: Joi.number().default(60 * 20 ),
    [JWT_REFRESH_TOKEN_LIFE]: Joi.number().default(60 * 60 * 24 * 30),
  }),
  validationOptions: {
    abortEarly: false,
  },
};
