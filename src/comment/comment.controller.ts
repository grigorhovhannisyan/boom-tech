import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards
} from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { swaggerConst } from "../constant/swagger.const";
import { PostResponse } from "../posts/response/post.response";
import { TokenGuard } from "../guard/token.guard";
import { CommentResponse } from "./response/comment.response";
import { JoiValidationPipe } from "../pipe/joi/joi-validation.pipe";
import { CreatePostDto, createPostDtoValidator } from "../posts/dto/create-post.dto";
import { CreateCommentDto, createCommentDtoValidator } from "./dto/create-comment.dto";
import { CommentPayload } from "./payload/comment.payload";
import { CommentService } from "./comment.service";
import { getCommentDtoValidator, GetCommentDto } from "./dto/get.comment.dto";
import { objectIdValidator } from "../common/dto/object-id.dto";
import { UpdatePostDto, updatePostDtoValidator } from "../posts/dto/update-post.dto";
import { UpdateCommentDto, updateCommentDtoValidator } from "./dto/update-comment.dto";

@ApiInternalServerErrorResponse(swaggerConst.apiResponse.internalServerError)
@Controller("comment")
export class CommentController {
  constructor(
    private readonly commentService: CommentService
  ) {
  }

  @ApiTags(swaggerConst.tag.comment)
  @ApiOkResponse({
    description: "Crated comment",
    type: CommentResponse
  })
  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @ApiConsumes("application/x-www-form-urlencoded")
  @Post("create")
  async create(
    @Req() req,
    @Body(new JoiValidationPipe(createCommentDtoValidator)) dto: CreateCommentDto
  ): Promise<CommentResponse> {
    const { post, text } = dto;
    const payload: CommentPayload = {
      post,
      text,
      author: req.token.user.id
    };
    return await this.commentService.createComment(payload);
  }


  @ApiTags(swaggerConst.tag.comment) @ApiOkResponse({
    description: "Comment list",
    type: [CommentResponse]
  })
  @ApiConsumes("application/x-www-form-urlencoded")
  @Get("findAll")
  async getComment(
    @Query(new JoiValidationPipe(getCommentDtoValidator)) dto: GetCommentDto
  ): Promise<CommentResponse[]> {
    return await this.commentService.findAll(dto);
  }


  @ApiTags(swaggerConst.tag.comment)
  @ApiOkResponse({
    description: "Updated comment",
    type: CommentResponse
  })
  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @ApiConsumes("application/x-www-form-urlencoded")
  @Patch("update")
  async update(
    @Body(new JoiValidationPipe(updateCommentDtoValidator)) dto: UpdateCommentDto,
    @Req() req
  ) {
    const {text,post}=dto
    const payload:CommentPayload={
      text
    }
    const userid=req.token.user.id
    return await this.commentService.update(post,payload,userid)
  }

  @ApiTags(swaggerConst.tag.comment)
  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Delete("delete:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param("id", new JoiValidationPipe(objectIdValidator)) id: string,
    @Req() req
  ) {
    const userid =req.token.user.id
    return await this.commentService.remove(id,userid)
  }
}