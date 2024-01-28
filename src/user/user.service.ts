import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schema/user.schema";
import { Model } from "mongoose";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { AuthService } from "../auth/auth.service";
import { JwtTokenResponse } from "../auth/response/jwt-token.response";
import { UserResponse } from "./response/user.response";
import * as mongoose from "mongoose";

import { UserPayload } from "./payload/user.payload";

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const {username, firstName, lastName, password,gender} = createUserDto
    const user=await this.userModel.findOne({username:username}).exec()
    if (!user){
      const payload:UserPayload={
        username,
        firstName,
        lastName,
        password:await bcrypt.hash(createUserDto.password, 10),
        gender
      }

      return this.userModel.create(payload);
    }
    else {
      throw new BadRequestException({ error: 'a user with this username already exists' })
    }

  }


  async getUserByUsername(username: string): Promise<User> {
    const user = await this.userModel
      .findOne({ username, isDeleted: false })
      .exec();
    if (!user) {
      throw new NotFoundException(`User with: ${username} not found`);
    }
    return user;
  }


  async update(userId: string, updateUserDto: UpdateUserDto): Promise<void> {
    const update = { $set: { ...updateUserDto } };
    await this.userModel.findOneAndUpdate({ _id: userId }, update);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userModel.deleteOne({ _id: userId });
  }


  async getUserById(userId: string): Promise<UserResponse> {
    const user = await this.userModel
      .aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(userId),
          },
        },

        {
          $project: {
            id: "$_id",
            _id: 0,
            username: "$username",
            firstName: "$firstName",
            lastName: "$lastName",
            gender: "$gender",

          },
        },
      ])
      .then((res) => res?.[0]);
    return user as UserResponse;
  }
}
