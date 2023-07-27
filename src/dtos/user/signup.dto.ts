import z from 'zod';

export interface SignupInputDTO {
    nickname: string,
    email: string,
    password: string
}

export interface SignupOutputDTO {
    token: string
}

export const SignupSchema = z.object({
    nickname: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(1)
}).transform(data => data as SignupInputDTO)