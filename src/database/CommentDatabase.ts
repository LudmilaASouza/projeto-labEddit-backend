import { CommentDB, CommentVoteDB } from '../models/Comment';
import { BaseDatabase } from './BaseDatabase';

export class CommentDatabase extends BaseDatabase {
    public static TABLE_COMMENTS = "comments"
    public static TABLE_COMMENTS_VOTES = "comments_votes"

    public insertComment = async (commentDB: CommentDB): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .insert(commentDB)
    }

    public getPostComments = async (postId: string): Promise<CommentDB[]> => {
        return BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .where({ post_id: postId })
    }

    public findById = async (id: string): Promise<CommentDB | undefined> => {
        const [commentDB]: CommentDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .select()
            .where({ id: id })
        return commentDB
    }

    public updateComment = async (commentDB: CommentDB): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .update({
                content: commentDB.content,
                votes_count: commentDB.votes_count
            })
            .where({ id: commentDB.id })
    }

    public findCommentVote =
        async (commentId: string, userId: string): Promise<CommentVoteDB | undefined> => {
            const [commentVoteDB]: CommentVoteDB[] = await BaseDatabase
                .connection(CommentDatabase.TABLE_COMMENTS_VOTES)
                .select()
                .where({
                    comment_id: commentId,
                    user_id: userId
                })
            return commentVoteDB
        }

    public insertCommentVote
        = async (commentId: string, userId: string, vote: Number): Promise<void> => {
            await BaseDatabase
                .connection(CommentDatabase.TABLE_COMMENTS_VOTES)
                .insert({
                    comment_id: commentId,
                    user_id: userId,
                    vote: vote
                })
        }

    public updateCommentVote
        = async (commentId: string, userId: string, vote: number): Promise<void> => {
            await BaseDatabase
                .connection(CommentDatabase.TABLE_COMMENTS_VOTES)
                .update({
                    vote: vote
                })
                .where({
                    comment_id: commentId,
                    user_id: userId
                })
        }

    public deleteCommentVote
        = async (commentId: string, userId: string): Promise<void> => {
            await BaseDatabase
                .connection(CommentDatabase.TABLE_COMMENTS_VOTES)
                .delete()
                .where({
                    comment_id: commentId,
                    user_id: userId
                })
        }
}