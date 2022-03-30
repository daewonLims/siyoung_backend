import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../domain/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './security/payload.interface';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    /**
     * 유저 등록시 중복 validation check 후 처리
     * @param newUser UserDto
     * @returns UserService save(newUser)
     * throw username으로 조회 
     * - 있는 경우 중복되어 HttpException으로 throw발생 : HttpStatus Bad Request- status:400
     */
    async registerUser(newUser: UserDTO): Promise<UserDTO> {
        let userFind: UserDTO = await this.userService.findByFields({
            where: { username: newUser.username }
        });
        if (userFind) {
            throw new HttpException('User name aleady used!', HttpStatus.BAD_REQUEST)
        } else {
            return await this.userService.save(newUser);
        }
    }

    async validateUser(userDto: UserDTO): Promise<{ accessToken: string } | undefined> {
        let userFind: User = await this.userService.findByFields({
            where: {username: userDto.username }
        });
        //암호화한 db에 있는 hash데이터와 비교
        const validatePassword = await bcrypt.compare(userDto.password, userFind.password);
        if ( !userFind || !validatePassword ) {
            throw new UnauthorizedException('Please again.');
        } else {
            this.converInAuthorities(userFind);
            // return userFind;
            const payload:Payload = { 
                id: userFind.id, 
                username: userFind.username, 
                authorities: userFind.authorities 
            };
            // return "Login Success";
            return {
                accessToken: this.jwtService.sign(payload)
            };
        }
    }
    //유저 조회
    async tokenValidateUser(payload: Payload): Promise<User | undefined> {
        const userFind = await this.userService.findByFields({
            where: { id: payload.id }
        });
        this.flatAuthorities(userFind);
        return userFind;
    }

    private flatAuthorities( user: any ): User {
        if ( user && user.authorities ) {
            const authorities: string[] = [];
            user.authorities.forEach(authority => authorities.push(authority.authorityName));
            user.authorities = authorities;
        }
        return user;
    }

    private converInAuthorities( user: any ): User {
        if ( user && user.authorities ) {
            const authorities: any[] = [];
            user.authorities.forEach(authority => {
                authorities.push({name: authority.authorityName});
            });
            user.authorities = authorities;
            return user;
        }
    }
}
