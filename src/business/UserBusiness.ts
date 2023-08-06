import { UserDatabase } from '../database/UserDatabase';
import { LoginInputDTO, LoginOutputDTO } from '../dtos/user/login.dto';
import { SignupInputDTO, SignupOutputDTO } from '../dtos/user/signup.dto';
import { BadRequestError } from '../errors/BadRequestError';
import { ConflictError } from '../errors/ConflictError';
import { NotFoundError } from '../errors/NotFoundError';
import { TokenPayload, User } from '../models/User';
import { HashManager } from '../services/HashManager';
import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';


export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) { }

    public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
        const { nickname, email, password } = input

        const userExists = await this.userDatabase.findByEmail(email)

        if (userExists) {
            throw new ConflictError("E-mail já cadastrado")
        }

        const id = this.idGenerator.generate()

        const hashedPassword = await this.hashManager.hash(password)

        const user = new User(
            id,
            nickname,
            email,
            hashedPassword
        )

        await this.userDatabase.insertUser(user.toDBModel())

        const payload: TokenPayload = {
            id: user.getId(),
            nickname: user.getNickname()
        }

        const token = this.tokenManager.createToken(payload)

        const output: SignupOutputDTO = {
            token: token
        }

        return output
    };

    public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
        const { email, password } = input

        const userDB = await this.userDatabase.findByEmail(email)

        if (!userDB) {
            throw new NotFoundError("E-mail não cadastrado")
        }

        const user = new User(
            userDB.id,
            userDB.nickname,
            userDB.email,
            userDB.password
        )

        const isPasswordCorrect = await this.hashManager
            .compare(password, user.getPassword())

        if (!isPasswordCorrect) {
            throw new BadRequestError("Senha incorreta")
        }

        const payload: TokenPayload = {
            id: user.getId(),
            nickname: user.getNickname()
        }

        const token = this.tokenManager.createToken(payload)

        const output: LoginOutputDTO = {
            token: token
        }

        return output
    };
};