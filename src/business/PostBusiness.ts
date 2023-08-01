import { IdGenerator } from './../services/IdGenerator';
import { UserDatabase } from './../database/UserDatabase';
import { TokenManager } from '../services/TokenManager';
import { CreatePostInputDTO, CreatePostOutputDTO } from '../dtos/post/createPost.dto';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { Post, PostModel } from '../models/Post';
import { PostDatabase } from '../database/PostDatabase';
import { GetPostsInputDTO, GetPostsOutputDTO } from '../dtos/post/getPosts.dto';


export class PostBusiness {
    constructor (
        private postDatabase: PostDatabase,
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenmanager: TokenManager
    ){}

    public createPost = 
        async (input: CreatePostInputDTO): Promise<CreatePostOutputDTO> => {
            const { token, content } = input 
            
            const payload = this.tokenmanager.getPayload(token)

            if(!payload) {
                throw new UnauthorizedError("Token inválido.")
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


}