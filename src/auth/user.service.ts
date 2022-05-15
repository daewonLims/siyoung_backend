import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions } from "typeorm";
// import { UserRepository } from "./repository/user.repository";
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from "@nestjs/mongoose";
import { User, User as UserinSchema, UserDocument } from "src/domain/user.schema";
import { Model } from "mongoose";
import { UserAuthority, UserAuthorityDocument } from "src/domain/user-authority.schema";

@Injectable()
export class UserService {
    // constructor(
    //     @InjectRepository(UserRepository)
    //     private userRepository: UserRepository
    // ) {}

    constructor(
        @InjectModel(UserinSchema.name) private userModel: Model<UserDocument>,
        @InjectModel(UserAuthority.name) private userauthorityModel: Model<UserAuthorityDocument>
    ){}
    /*TEST*/
    async findAccount(userDto:UserDTO):Promise<any> {
        return await this.userModel.findOne(userDto);
    }
    async findById(userID: string): Promise<any> {
        return await this.userModel.find({"userId":userID}).exec();
    }
    /**
     * 단건 조회 로직
     * @param options FindOneOption<UserDTO>
     * @returns UserRepository findOne(options)
     */
    async findByFields(options: FindOneOptions<UserDTO>): Promise<User | undefined> {
        return await this.userModel.findOne(options);
    }
    /**
     * 유저 저장 로직
     * @param userDto UserDto
     * @returns UserRepository save(userDto)
     */
    async save(userDto: UserDTO): Promise<UserDTO | undefined> {
        await this.transformPassword(userDto);
        console.log(userDto);
        const createUserDto = new this.userModel(userDto);
        return await createUserDto.save();
    }

    async transformPassword(user: UserDTO): Promise<void> {
        user.password = await bcrypt.hash(
            user.password, 10,
        );
        return Promise.resolve();
    }
}