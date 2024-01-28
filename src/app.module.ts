import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { configModuleOptions } from "./options/config/config-module.options";
import { UserModule } from "./user/user.module";
import { MongooseModule } from "@nestjs/mongoose";
import { mongooseModuleAsyncOptions } from "./options/mongoose/mongoose-module-async.options";
import { AuthModule } from "./auth/auth.module";
import { PostsModule } from './posts/posts.module';
import { CommentModule } from './comment/comment.module';


@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    MongooseModule.forRootAsync(mongooseModuleAsyncOptions),
    UserModule,
    AuthModule,
    PostsModule,
    CommentModule,

  ],
  providers: [],
})
export class AppModule {}
