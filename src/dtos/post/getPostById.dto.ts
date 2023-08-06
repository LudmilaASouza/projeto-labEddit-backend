import z from "zod"
import { PostModel } from "../../models/Post"


export interface GetPostByIdInputDTO {
    token: string,
    postId: string
}

export type GetPostByIdOutputDTO = PostModel

export const GetPostByIdSchema = z.object({
    token: z.string().min(1),
    postId: z.string().min(1)
}).transform(data => data as GetPostByIdInputDTO)