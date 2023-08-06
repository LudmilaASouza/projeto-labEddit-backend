import z from "zod"

export interface VotePostInputDTO {
    token: string,
    postId: string,
    vote: boolean
}

export type VotePostOutputDTO = undefined

export const VotePostSchema = z.object({
    token: z.string().min(1),
    postId: z.string().min(1),
    vote: z.boolean()
}).transform(data => data as VotePostInputDTO)