export interface PostDB {
    id: string,
    creator_id: string,
    content: string,
    votes_count: number,
    comments_count: number,
    created_at: string
};

export interface PostModel {
    id: string,
    content: string,
    votesCount: number,
    commentsCount: number,
    createdAt: string,
    creator: {
        id: string,
        nickname: string
    }
};

export interface PostVoteDB {
    post_id: string,
    user_id: string,
    vote: number
};

export class Post {
    constructor(
        private id: string,
        private content: string,
        private votesCount: number,
        private commentsCount: number,
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

    public getCommentsCount(): number {
        return this.commentsCount
    }
    public setCommentsCount(value: number): void {
        this.commentsCount = value
    }

    public increaseVotesCount(): void {
        this.votesCount += 1
    }
    public decreaseVotesCount(): void {
        this.votesCount -= 1
    }

    public increaseCommentsCount(): void {
        this.commentsCount += 1
    }
    public decreaseCommentsCount(): void {
        this.commentsCount -= 1
    }

    public getCreatedAt(): string {
        return this.createdAt
    }
    public setCreatedAt(value: string): void {
        this.createdAt = value
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

    public toDBModel(): PostDB {
        return {
            id: this.id,
            creator_id: this.creatorId,
            content: this.content,
            votes_count: this.votesCount,
            comments_count: this.commentsCount,
            created_at: this.createdAt
        }
    }

    public toBusinessModel(): PostModel {
        return {
            id: this.id,
            content: this.content,
            votesCount: this.votesCount,
            commentsCount: this.commentsCount,
            createdAt: this.createdAt,
            creator: {
                id: this.creatorId,
                nickname: this.creatorNickname
            }
        }
    }
}