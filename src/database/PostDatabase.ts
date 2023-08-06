import { PostDB, PostVoteDB } from './../models/Post';
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase{
    public static TABLE_POSTS = "posts"
    public static TABLE_POSTS_VOTES = "posts_votes"

    public insertPost = async (postDB: PostDB): Promise<void> => {
        await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .insert(postDB)
    }

    public getPosts = async (): Promise<PostDB[]> => {
        return BaseDatabase.connection(PostDatabase.TABLE_POSTS)
    }

    public findById = async (id: string): Promise<PostDB | undefined> => {
        const [postDB]: PostDB[] = await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .select()
        .where({id: id})

        return postDB
    }

    public findPostVote = async (postId: string, userId: string): Promise<PostVoteDB | undefined> => {
        const [postVoteDB]: PostVoteDB[] = await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS_VOTES)
        .select()
        .where({
            post_id: postId,
            user_id: userId
        })

        return postVoteDB
    }

    public updatePostVote = async (postId: string, userId: string, vote: number): Promise<void> => {
        await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS_VOTES)
        .update({vote: vote})
        .where({
            post_id: postId,
            user_id: userId
        })
    }

    public deletePostVote = async (postId: string, userId: string): Promise<void> => {
        await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS_VOTES)
        .delete()
        .where({
            post_id: postId,
            user_id: userId
        })
    }

    public updatePost = async (postDB: PostDB): Promise<void> => {
        await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .update({
            content: postDB.content,
            votes_count: postDB.votes_count,
            comments_count: postDB.comments_count
        })
        .where({ id: postDB.id })
    }

    public insertPostVote = async (postId: string, userId: string, vote: Number): Promise<void> => {
        await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS_VOTES)
        .insert({
            post_id: postId,
            user_id: userId,
            vote: vote
        })
    }

}