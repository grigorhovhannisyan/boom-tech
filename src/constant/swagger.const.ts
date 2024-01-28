import { ApiResponseOptions } from "@nestjs/swagger";
import { JoiUnprocessableEntityExceptionArg } from "../pipe/joi/joi-unprocessable-entity.exception";


export const swaggerConst = {
  tag: {
    auth: "Auth",
    user: "User",
    posts: "Posts",
    comment: "Comment"

  },

  apiResponse: {
    unprocessableEntity: {
      description:
        "The request was invalid and/or malformed. The response will contain an Errors JSON Object with the specific errors",
      type: [JoiUnprocessableEntityExceptionArg],
    } as ApiResponseOptions,

    badRequest: {
      description:
        "The request was invalid and/or malformed. The response will contain an Errors JSON Object with the specific errors",
    } as ApiResponseOptions,

    notFound: {
      description: "The object doesn't exist.",
    } as ApiResponseOptions,

    forbidden: {
      description: "The request was not allow",
    } as ApiResponseOptions,

    internalServerError: {
      description: "There was an internal error",
    } as ApiResponseOptions,

  },
  logoLink:"https://static.wixstatic.com/media/7a23a2_ba340db3047a4f3d8766e53b88811044~mv2.png/v1/fill/w_244,h_50,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/Group%20562.png"

 };
