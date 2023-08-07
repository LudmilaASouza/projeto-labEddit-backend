import { GetPostByIdInputDTO, GetPostByIdOutputDTO } from './../dtos/post/getPostById.dto';
import { IdGenerator } from './../services/IdGenerator';
import { UserDatabase } from './../database/UserDatabase';
import { TokenManager } from '../services/TokenManager';
import { CreatePostInputDTO, CreatePostOutputDTO } from '../dtos/post/createPost.dto';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { Post, PostModel } from '../models/Post';
import { PostDatabase } from '../database/PostDatabase';
import { GetPostsInputDTO, GetPostsOutputDTO } from '../dtos/post/getPosts.dto';
import { VotePostInputDTO, VotePostOutputDTO } from '../dtos/post/votePost.dto';
import { NotFoundError } from '../errors/NotFoundError';



export class PostBusiness {
    constructor (
        private postDatabase: PostDatabase,
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenmanager: TokenManager
    ){}

    public createPost = async (input: CreatePostInputDTO): Promise<CreatePostOutputDTO> => {
        const { token, content } = input

        const payload = this.tokenmanager.getPayload(token)
        if (!payload) {
            throw new UnauthorizedError("Token inválido")
        }

        const id = this.idGenerator.generate()

        const post = new Post(
            id,
            content,
            0,
            0,
            new Date().toISOString(),
            payload.id,
            payload.nickname
        )

        await this.postDatabase.insertPost(post.toDBModel())

        const output: CreatePostOutputDTO = undefined

        return output
    }

    public getPosts = 
        async (input: GetPostsInputDTO): Promise<GetPostsOutputDTO> => {

            const { token } = input 

            const payload = this.tokenmanager.getPayload(token)
            if(!payload) {
                throw new UnauthorizedError("Token inválido.")
            }

            const postsDB = await this.postDatabase.getPosts()

            const postsModel: PostModel[] = []

            for (let postDB of postsDB) {
                const userDB = await this.userDatabase.findById(postDB.creator_id)

                const post = new Post(
                    postDB.id,
                    postDB.content,
                    postDB.votes_count,
                    postDB.comments_count,
                    postDB.created_at,
                    postDB.creator_id,
                    userDB.nickname
                )

                postsModel.push(post.toBusinessModel())
            }

            const output: GetPostsOutputDTO = postsModel
            return output

    }

    public getPostById = async (input: GetPostByIdInputDTO): Promise<GetPostByIdOutputDTO> => {
        
        const {token, postId} = input

        const payload = this.tokenmanager.getPayload(token)
        if (!payload) {
            throw new UnauthorizedError("Token inválido.")
        }

        const postDB = await this.postDatabase.findById(postId)
        if (!postDB) {
            throw new NotFoundError ("Id não existe.")
        }

        const userDB = await this.userDatabase.findById(postDB.creator_id)

        const post = new Post (
            postDB.id,
            postDB.content,
            postDB.votes_count,
            postDB.comments_count,
            postDB.created_at,
            postDB.creator_id,
            userDB.nickname
        )

        const output: GetPostByIdOutputDTO = post.toBusinessModel()
        return output
    }



    public votePost = async (input: VotePostInputDTO) : Promise<VotePostOutputDTO> => {

        const {token, postId, vote} = input

        const payload = this.tokenmanager.getPayload(token)
        if(!payload){
            throw new UnauthorizedError("Token inválido.")
        }

        const postDB = await this.postDatabase.findById(postId)
        if(!postDB) {
            throw new NotFoundError ("Id não existe.")
        }

        const userDB = await this.userDatabase.findById(postDB.creator_id)

        const post = new Post (
            postDB.id,
            postDB.content,
            postDB.votes_count,
            postDB.comments_count,
            postDB.created_at,
            postDB.creator_id,
            userDB.nickname
        )

        const voteAsNumber = vote ? 1 : 0

        const postVoteDB = await this.postDatabase.findPostVote(postId, payload.id)

        if(postVoteDB) {
            if (postVoteDB.vote) {
                if (vote) {
                    post.decreaseVotesCount()
                    await this.postDatabase.deletePostVote(postId, payload.id)
                } else {
                    post.decreaseVotesCount()
                    post.decreaseVotesCount()
                    await this.postDatabase.updatePostVote(postId, payload.id, voteAsNumber)
                }
            } else {
                if (vote) {
                    post.increaseVotesCount()
                    post.increaseVotesCount()
                    await this.postDatabase.updatePostVote(postId, payload.id, voteAsNumber)
                } else {
                    post.increaseVotesCount()
                    await this.postDatabase.deletePostVote(postId, payload.id)
                }
            }

            await this.postDatabase.updatePost(post.toDBModel())

        }else {
            vote ? post.increaseVotesCount() : post.decreaseVotesCount()
            await this.postDatabase.updatePost(post.toDBModel())
            await this.postDatabase.insertPostVote(postId, payload.id, voteAsNumber)
        }

        const output: VotePostOutputDTO = undefined
        return output
    }
}