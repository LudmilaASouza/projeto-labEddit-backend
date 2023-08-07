export interface CommentDB {
    id: string,
    post_id: string,
    creator_id: string,
    content: string,
    votes_count: number,
    created_at: string
};

export interface CommentModel {
    id: string,
    postId: string,
    content: string,
    votesCount: number,
    createdAt: string,
    creator: {
        id: string,
        nickname: string
    }
};

export interface CommentVoteDB {
    comment_id: string,
    user_id: string,
    vote: number
};

export class Comment {
    constructor(
        private id: string,
        private postId: string,
        private content: string,
        private votesCount: number,
        private createdAt: string,
        private creatorId: string,
        private creatorNickname: string
    ) { }

    public getId(): string {
        return this.id
    }
    public setId(value: string): void {
        this.id = value
    }

    public getPostID(): string {
        return this.postId
    }
    public setPostID(value: string): void {
        this.postId = value
    }

    public getContent(): string {
        return this.content
    }
    public setContent(value: string): void {
        this.content = value
    }

    public getVotesCount(): number {
        return this.votesCount
    }
    public setVotesCount(value: number): void {
        this.votesCount = value
    }

    public getCreatedAt(): string {
        return this.createdAt
    }
    public setCreatedAt(value: string): void {
        this.createdAt = value
    }

    public increaseVotesCount(): void {
        this.votesCount += 1
    }
    public decreaseVotesCount(): void {
        this.votesCount -= 1
    }

    public getCreatorId(): string {
        return this.creatorId
    }
    public setCreatorId(value: string): void {
        this.creatorId = value
    }

    public getCreatorNickname(): string {
        return this.creatorNickname
    }
    public setCreatorNickname(value: string): void {
        this.creatorNickname = value
    }

    public toDBModel(): CommentDB {
        return {
            id: this.id,
            post_id: this.postId,
            creator_id: this.creatorId,
            content: this.content,
            votes_count: this.votesCount,
            created_at: this.createdAt
        }
    }

    public toBusinessModel(): CommentModel {
        return {
            id: this.id,
            postId: this.postId,
            content: this.content,
            votesCount: this.votesCount,
            createdAt: this.createdAt,
            creator: {
                id: this.creatorId,
                nickname: this.creatorNickname
            }
        }
    }
};