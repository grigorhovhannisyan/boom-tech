import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

export type PostDocument = Post & Document

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  body: string;
  @Prop({
    type: mongoose.Schema.Types.ObjectId
  })
  author: mongoose.Schema.Types.ObjectId;
}
export const PostSchema=SchemaFactory.createForClass(Post)
PostSchema.index({createdAt: -1})