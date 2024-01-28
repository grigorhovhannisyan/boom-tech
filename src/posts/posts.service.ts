import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { PostPayload } from "./payload/post.payload";
import { InjectModel } from "@nestjs/mongoose";
import { Post, PostDocument, PostSchema } from "./schema/post.schema";
import { Model } from "mongoose";
import * as mongoose from "mongoose";
import { PostResponse } from "./response/post.response";
import { GetPostsDto } from "./dto/get.posts.dto";
import { Comment, CommentDocument } from "../comment/schema/comment.schema";

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>
  ) {
  }

  async create(payload: PostPayload):Promise<PostResponse> {
    const newPost= await this.postModel.create(payload);
    return await this.getPostById(newPost._id)
  }

  private async getPostById(id):Promise<PostResponse> {
    const condition: any = { _id: new mongoose.Types.ObjectId(id) };
    const post = await this.postModel.aggregate([
      { $match: condition },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: '_id',
          pipeline: [
            {
              $project: {
                id:"$_id",
                _id:0,
                username: "$username",
                firstName: "$firstName",
                lastName: "$lastName",
                gender: "$gender",
              },
            },
          ],
          as: "author",
        },
      },
      {
        $project: {
          id: '$_id',
          _id: 0,
          title: '$title',
          body: '$body',
          author: { $arrayElemAt: ["$author", 0] },
          createdAt: '$createdAt',
          updatedAt: '$updatedAt'
        }
      }
    ]).then(res => res?.[0]);
    return post as PostResponse;
  }

  async findAll(options:GetPostsDto):Promise<PostResponse[]> {
    const { limit, offset, text}=options
    const condition:any={}
    if (text) {
      const searchText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      condition.$or = [
        { 'title': new RegExp(searchText, 'i') },
        { 'body': new RegExp(searchText, 'i') },
      ]
    }
    const posts=await this.postModel.aggregate([
      {$match:condition},
      { $skip: Number(offset) || 0 },
      { $limit: Number(limit) || 20 },
      { $sort: { "createdAt": -1 } },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: '_id',
          pipeline: [
            {
              $project: {
                id:"$_id",
                _id:0,
                username: "$username",
                firstName: "$firstName",
                lastName: "$lastName",
                gender: "$gender",
              },
            },
          ],
          as: "author",
        },
      },
      {
        $project: {
          id: '$_id',
          _id: 0,
          title: '$title',
          body: '$body',
          author: { $arrayElemAt: ["$author", 0] },
          createdAt: '$createdAt',
          updatedAt: '$updatedAt'
        }
      }
    ])
    return posts as PostResponse[]
  }

  async update(id, payload: PostPayload,userid):Promise<PostResponse> {
    const post=await this.postModel.findOne(
      {_id:new mongoose.Types.ObjectId(id)}).exec()
    if (post){
      if (post.author==userid){
        const update= {$set:payload}
        const updatedPost=await this.postModel.findOneAndUpdate(
          {_id:new mongoose.Types.ObjectId(id) },
          update)
        return await this.getPostById(updatedPost._id)
      }
      throw new BadRequestException({error:"bad request"})
    }
    throw new NotFoundException({error:"post not found"})

  }


async  remove(id,userid) {
    const objId=new mongoose.Types.ObjectId(id)
  const post=await this.postModel.findOne({_id:objId}).exec()
  if (post.author==userid){
    await this.postModel.deleteOne({_id:objId})
    await this.commentModel.deleteMany({postId:objId })
  }
   throw new BadRequestException({error:"bad request"})
  }

}
