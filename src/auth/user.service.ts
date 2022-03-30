import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions } from "typeorm";
import { UserRepository } from "./repository/user.repository";
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../domain/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {}
    /**
     * 단건 조회 로직
     * @param options FindOneOption<UserDTO>
     * @returns UserRepository findOne(options)
     */
    async findByFields(options: FindOneOptions<UserDTO>): Promise<User | undefined> {
        return await this.userRepository.findOne(options);
    }
    /**
     * 유저 저장 로직
     * @param userDto UserDto
     * @returns UserRepository save(userDto)
     */
    async save(userDto: UserDTO): Promise<UserDTO | undefined> {
        await this.transformPassword(userDto);
        console.log(userDto);
        return this.userRepository.save(userDto);
    }

    async transformPassword(user: UserDTO): Promise<void> {
        user.password = await bcrypt.hash(
            user.password, 10,
        );
        return Promise.resolve();
    }
}