import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { GenderEnum } from "./gender.enum";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true })
  username: string;
  @Prop({ required: true, private: true })
  password: string;
  @Prop({
    required: true,
    enum: Object.values(GenderEnum),
    default: GenderEnum.FEMALE
  })
  gender?: GenderEnum;
  @Prop()
  firstName: string;
  @Prop()
  lastName: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ createdAt: -1 });
