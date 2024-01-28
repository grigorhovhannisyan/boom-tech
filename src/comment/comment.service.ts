import { InjectModel } from "@nestjs/mongoose";
import { Comment, CommentDocument } from "./schema/comment.schema";
import { Model } from "mongoose";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CommentResponse } from "./response/comment.response";
import * as mongoose from "mongoose";
import { Post, PostDocument } from "../posts/schema/post.schema";
import { GetCommentDto } from "./dto/get.comment.dto";
import { CommentPayload } from "./payload/comment.payload";

@Injectable()
export class CommentService{
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>
  ) {
  }
  async createComment(payload):Promise<CommentResponse>{
    const post=await this.postModel.findOne(
      {_id:new mongoose.Types.ObjectId(payload.post)})
    if(!post){
      throw new NotFoundException({error:"post not found"})
    }
     const newComment = await this.commentModel.create(payload)
    return await this.getCommentById(newComment._id)
  }

  private async getCommentById(id):Promise<CommentResponse>{
    const condition: any = { _id: new mongoose.Types.ObjectId(id) };
    const comment = await this.commentModel.aggregate([
      {$match:condition},
      {$sort:{createdAt:-1}},
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
        $project:{
          id:"$_id",
          _id:0,
          post:"$post",
          text:"$text",
          author: { $arrayElemAt: ["$author", 0] },
          createdAt:"$createdAt",
          updatedAt:"$updatedAt"
        }
      }
    ]).then(res => res?.[0]);
    return comment as CommentResponse

  }

  async findAll(options:GetCommentDto):Promise<CommentResponse[]>{
    const { post, limit, offset, text}=options
    const condition:any={post:new mongoose.Types.ObjectId(post)}
    if (text) {
      const searchText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      condition.$or = [
        { 'text': new RegExp(searchText, 'i') },
      ]
    }
    const comments=await this.commentModel.aggregate([
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
          text: '$text',
          author: { $arrayElemAt: ["$author", 0] },
          createdAt: '$createdAt',
          updatedAt: '$updatedAt'
        }
      }
    ])
    return comments as CommentResponse[]
  }

  async update(postId,payload:CommentPayload,userid){
     const comment=await this.commentModel.findOne(
       {_id:new mongoose.Types.ObjectId(postId)}).exec()
    if (comment){
      if (comment.author==userid){
        const update= {$set:payload}
        const updatedComment=await this.commentModel.findOneAndUpdate(
          {_id:new mongoose.Types.ObjectId(postId)},
          update
        ).exec()
        return await this.getCommentById(updatedComment._id)
      }
      throw new BadRequestException({error:'bad request'})
    }
    throw new NotFoundException({error:"comment not found"})


  }

  async remove(commentId,userid){
    const comment=await this.commentModel.findOne(
      {_id:new mongoose.Types.ObjectId(commentId)}).exec()
    if (!comment){
      throw new NotFoundException({error:'comment not found'})

    }
    if (comment.author.toString()!=userid){
      throw new BadRequestException({error:'bad request'})
    }
   await this.commentModel.deleteOne({_id:new mongoose.Types.ObjectId(commentId)})


  }
}