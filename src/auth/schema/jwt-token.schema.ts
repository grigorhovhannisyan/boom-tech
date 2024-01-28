import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Scope } from "./scope";
import { User, UserDocument } from "../../user/schema/user.schema";

export type JwtTokenDocument = JwtToken & Document;

@Schema({ collection: "jwt-tokens", timestamps: true })
export class JwtToken {
  @Prop({ required: true })
  accessToken: string;
  @Prop({ required: true })
  refreshToken: string;
  @Prop({
    required: true,
    enum: Object.values(Scope),
    default: Scope.MEMBER,
  })
  scope: Scope;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  user: UserDocument;
}

export const JwtTokenSchema = SchemaFactory.createForClass(JwtToken);
