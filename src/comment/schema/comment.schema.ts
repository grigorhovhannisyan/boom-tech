import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Post } from "../../posts/schema/post.schema";


export type CommentDocument = Comment & Document

@Schema({timestamps:true})
export class Comment {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Post.name
  })
  post: mongoose.Schema.Types.ObjectId
  @Prop()
  text: string
  @Prop({
    type: mongoose.Schema.Types.ObjectId
  })
  author: mongoose.Schema.Types.ObjectId;
}
export const CommentSchema=SchemaFactory.createForClass(Comment)
CommentSchema.index({createdAt:-1})