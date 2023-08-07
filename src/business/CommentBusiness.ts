import { CommentDatabase } from '../database/CommentDatabase';
import { PostDatabase } from '../database/PostDatabase';
import { UserDatabase } from '../database/UserDatabase';
import { CreateCommentInputDTO, CreateCommentOutputDTO } from '../dtos/comment/createComment.dto';
import { NotFoundError } from '../errors/NotFoundError';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';
import { Comment, CommentModel } from '../models/Comment';
import { Post } from '../models/Post';
import { GetCommentsInputDTO, GetCommentsOutputDTO } from '../dtos/comment/getComments.dto';

export class CommentBusiness {
    constructor(
        private commentDatabase: CommentDatabase,
        private postDatabase: PostDatabase,
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) {}

    public createComment = async (input: CreateCommentInputDTO): Promise<CreateCommentOutputDTO> => {
        
        const { token, postId, content } = input

        const payload = this.tokenManager.getPayload(token)
        if (!payload) {
            throw new UnauthorizedError ("Token inválido.")
        }

        const postDB = await this.postDatabase.findById(postId)
        if(!postDB) {
            throw new NotFoundError ("Post com essa id não existe.")
        }

        const id = this.idGenerator.generate()

        const comment = new Comment (
            id,
            postId,
            content,
            0,
            new Date().toISOString(),
            payload.id,
            payload.nickname
        )

        await this.commentDatabase.insertComment(comment.toDBModel())

        const creatorDB = await this.userDatabase.findById(postDB.creator_id)

        const post = new Post(
            postDB.id,
            postDB.content,
            postDB.votes_count,
            postDB.comments_count,
            postDB.created_at,
            postDB.creator_id,
            creatorDB.nickname
        )

        post.increaseCommentsCount()
        await this.postDatabase.updatePost(post.toDBModel())

        const output: CreateCommentOutputDTO = undefined
        return output
    }

    public getComments = async (input: GetCommentsInputDTO): Promise<GetCommentsOutputDTO> => {

        const { token, postId } = input

        const payload = this.tokenManager.getPayload(token)
        if (!payload) {
            throw new UnauthorizedError ("Token inválido.")
        }

        const commentsDB = await this.commentDatabase.getPostComments(postId)
        
        const commentsModel : CommentModel[] = []

        for (let commentDB of commentsDB) {
            const userDB = await this.userDatabase.findById(commentDB.creator_id)

            const comment = new Comment (
                commentDB.id,
                commentDB.post_id,
                commentDB.content,
                commentDB.votes_count,
                commentDB.created_at,
                commentDB.creator_id,
                userDB.nickname
            )

            commentsModel.push(comment.toBusinessModel())
        }

        const output: GetCommentsOutputDTO = commentsModel
        return output
    }


}