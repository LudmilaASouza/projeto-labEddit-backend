import { ZodError } from 'zod';
import { CommentBusiness } from '../business/CommentBusiness';
import { CreateCommentSchema } from '../dtos/comment/createComment.dto';
import { Request, Response } from 'express';
import { BaseError } from '../errors/BaseError';


export class CommentController {
    constructor(
        private commentBusiness: CommentBusiness
    ) { }

    public createComment = async (req: Request, res: Response) => {
        try {
            const input = CreateCommentSchema.parse({
                token: req.headers.authorization,
                postId: req.params.postId,
                content: req.body.content
            })

            const response = await this.commentBusiness.createComment(input)

            res.status(201).send(response)

        } catch (error) {
            console.log(error)

            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }



}