import { Module } from "@nestjs/common";
import { CommentController } from "./comment.controller";
import { JwtModule } from "@nestjs/jwt";
import { jwtModuleAsyncOptions } from "../options/jwt/jwt-module-async.options";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "../auth/auth.module";
import { Comment, CommentSchema } from "./schema/comment.schema";
import { CommentService } from "./comment.service";
import { Post, PostSchema } from "../posts/schema/post.schema";

@Module({
  imports: [JwtModule.registerAsync(jwtModuleAsyncOptions),
    MongooseModule.forFeature([
      {name:Comment.name,schema:CommentSchema},
      { name: Post.name, schema: PostSchema },
    ]),
    AuthModule
  ],
  controllers:[CommentController],
  providers:[CommentService]

})
export class CommentModule {}