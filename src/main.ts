import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { swaggerConst } from "./constant/swagger.const";
import { PORT } from "./constant/env-key.const";


(async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  const configService = app.get(ConfigService);

  app.enableShutdownHooks();



  const docConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("BoomTech blog ")
    .setDescription("BoomTech  APIs")
    .setVersion("1.0");

  for (const t of Object.values(swaggerConst.tag)) {
    docConfig.addTag(t);
  }
  const schema = SwaggerModule.createDocument(app, docConfig.build());
  SwaggerModule.setup("/", app, schema, {
    customSiteTitle: 'BoomTech task',
    customCss:` .swagger-ui img { content:url(${swaggerConst.logoLink}); }`,
  } );



  const port = configService.get(PORT);
  await app.listen(port, () =>
    Logger.log(`Server listening on port '${port}'`, __filename),
  );
})();
