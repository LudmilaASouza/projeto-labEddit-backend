export interface TokenPayload {
    id: string,
    nickname: string
}

export interface UserDB {
    id: string,
    nickname: string,
    email: string,
    password: string
}

export class User {
    constructor(
        private id: string,
        private nickname: string,
        private email: string,
        private password: string
    ) {}

    public getId(): string {
        return this.id
    }
    public setId(value:string): void {
        this.id = value
    }

    public getNickname(): string {
        return this.nickname
    }
    public setNickname(value:string): void {
        this.nickname = value
    }

    public getEmail():string {
        return this.email
    }
    public setEmail(value:string): void{
        this.email = value
    }

    public getPassword():string {
        return this.password
    }
    public setPassword(value:string): void{
        this.password = value
    }

    public toDBModel():UserDB {
        return {
            id: this.id,
            nickname: this.nickname,
            email: this.email,
            password: this.password
        }
    }
}