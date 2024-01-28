import { Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsController } from "./posts.controller";
import { AuthModule } from "../auth/auth.module";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { jwtModuleAsyncOptions } from "../options/jwt/jwt-module-async.options";

import { MongooseModule } from "@nestjs/mongoose";
import { Post, PostSchema } from "./schema/post.schema";
import { Comment, CommentSchema } from "../comment/schema/comment.schema";

@Module({
  imports: [
    JwtModule.registerAsync(jwtModuleAsyncOptions),
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema }
    ]),
    AuthModule
  ],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {
}
