import { ZodError } from 'zod';
import { CreatePostSchema } from '../dtos/post/createPost.dto';
import { Request, Response } from 'express';
import { BaseError } from '../errors/BaseError';
import { PostBusiness } from '../business/PostBusiness';
import { GetPostsSchema } from '../dtos/post/getPosts.dto';
import { VotePostSchema } from '../dtos/post/votePost.dto';
import { GetPostByIdSchema } from '../dtos/post/getPostById.dto';

export class PostController {
    constructor(
        private postBusiness: PostBusiness
    ){}

    public createPost = async (req: Request, res: Response) => {
        try {
            const input = CreatePostSchema.parse({
                token: req.headers.authorization,
                content: req.body.content
            })

            const response = await this.postBusiness.createPost(input)
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

    public getPosts = async (req: Request, res: Response) => {
        try {
            const input = GetPostsSchema.parse({
                token: req.headers.authorization
            })

            const response = await this.postBusiness.getPosts(input)
            res.status(200).send(response)

        } catch (error) {
            console.log(error)

            if(error instanceof ZodError){
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado.")
            }

        }
    }

    public votePost = async (req: Request, res: Response) => {
        try {
            
            const input = VotePostSchema.parse({
                token: req.headers.authorization,
                postId: req.params.id,
                vote: req.body.vote
            })

            const response = await this.postBusiness.votePost(input)
            res.status(200).send(response)

        } catch (error) {
            console.log(error)

            if(error instanceof ZodError){
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado.")
            }
        }
    }

    public getPostById = async (req: Request, res: Response) => {
        try {
            const input = GetPostByIdSchema.parse({
                token: req.headers.authorization,
                postId: req.params.id
            })

            const response = await this.postBusiness.getPostById(input)
            res.status(200).send(response)

        } catch (error) {
            console.log(error)

            if(error instanceof ZodError){
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado.")
            }
        }
    }
}