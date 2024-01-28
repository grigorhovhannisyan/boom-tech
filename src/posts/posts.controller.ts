import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UsePipes, Query, HttpCode, HttpStatus } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto, createPostDtoValidator } from "./dto/create-post.dto";
import { UpdatePostDto, updatePostDtoValidator } from "./dto/update-post.dto";
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiOkResponse } from "@nestjs/swagger";
import { swaggerConst } from "../constant/swagger.const";
import { AuthorizedUser } from "../common/enum/user.enum";
import { TokenGuard } from "../guard/token.guard";
import { PostPayload } from "./payload/post.payload";
import { JoiValidationPipe } from "../pipe/joi/joi-validation.pipe";
import { PostResponse } from "./response/post.response";
import { GetPostsDto, getPostsDtoValidator } from "./dto/get.posts.dto";
import { objectIdValidator } from "src/common/dto/object-id.dto";

@Controller("blog/posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {
  }

  @ApiTags(swaggerConst.tag.posts)
  @ApiOkResponse({
    description: "Crated post",
    type:PostResponse
  })
  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @ApiConsumes("application/x-www-form-urlencoded")
  @Post('create')
  create(
    @Body(new JoiValidationPipe(createPostDtoValidator)) dto: CreatePostDto,
    @Req() req
  ):Promise<PostResponse> {
    const { title, body } = dto;
    const payload: PostPayload = {
      title,
      body,
      author: req.token.user.id
    };
    return this.postsService.create(payload);
  }

  @ApiTags(swaggerConst.tag.posts)
  @ApiOkResponse({
    description: "The posts list",
    type:[PostResponse]
  })
  @Get('findAll')
  findAll(
    @Query(new JoiValidationPipe(getPostsDtoValidator)) query: GetPostsDto,
  ):Promise<PostResponse[]> {
    return this.postsService.findAll(query);
  }

  @ApiTags(swaggerConst.tag.posts)
  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @ApiConsumes("application/x-www-form-urlencoded")
  @Patch(":id")
  update(
    @Param("id", new JoiValidationPipe(objectIdValidator)) id: string,
    @Body(new JoiValidationPipe(updatePostDtoValidator)) updatePostDto: UpdatePostDto,
    @Req() req
  ) {
    const {title,body}=updatePostDto
    const userid=req.token.user.id
    const payload:PostPayload={
      title,
      body
    }
    return this.postsService.update(id, payload,userid);
  }

  @ApiTags(swaggerConst.tag.posts)
  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  async remove(
    @Param("id", new JoiValidationPipe(objectIdValidator)) id: string,
    @Req() req
    ) {
    const userid=req.token.user.id
    await this.postsService.remove(id,userid);
  }
}
