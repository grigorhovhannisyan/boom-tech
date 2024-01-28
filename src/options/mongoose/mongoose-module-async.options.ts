import { ConfigModule, ConfigService } from "@nestjs/config";
import { MONGODB_URI } from "../../constant/env-key.const";

import * as mongooseToJson from "@meanie/mongoose-to-json";

export const mongooseModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>(MONGODB_URI),
    connectionFactory: (connection) => {
      connection.plugin(mongooseToJson);
      return connection;
    },
  }),
  inject: [ConfigService],
};
