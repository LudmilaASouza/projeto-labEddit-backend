import z from "zod"

export interface VoteCommentInputDTO {
    token: string,
    commentId: string,
    vote: boolean
}

export type VoteCommentOutputDTO = undefined

export const VoteCommentSchema = z.object({
    token: z.string().min(1),
    commentId: z.string().min(1),
    vote: z.boolean()
}).transform(data => data as VoteCommentInputDTO)