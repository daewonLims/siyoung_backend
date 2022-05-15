import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './security/payload.interface';
import { User } from 'src/domain/user.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async checkAccount(userDto:UserDTO): Promise<any> {
        let userInfo = await this.userService.findAccount(userDto);
        console.log('userInfo=',userInfo)
        return 'success'
    }

    /**
     * 유저 등록시 중복 validation check 후 처리
     * @param newUser UserDto
     * @returns UserService save(newUser)
     * throw username으로 조회 
     * - 있는 경우 중복되어 HttpException으로 throw발생 : HttpStatus Bad Request- status:400
     */
    async registerUser(newUser: UserDTO): Promise<UserDTO> {
        let userFind: UserDTO = await this.userService.findById(newUser.userId);
        console.log("test====",newUser);
        console.log("test====",userFind[0]);
        
        if (userFind[0]!==undefined) {
            throw new HttpException('User name aleady used!', HttpStatus.BAD_REQUEST)
        } else {
            return await this.userService.save(newUser);
        }
    }
    /*
    model.find({
    '_id': { $in: [
        mongoose.Types.ObjectId('4ed3ede8844f0f351100000c'),
        mongoose.Types.ObjectId('4ed3f117a844e0471100000d'), 
        mongoose.Types.ObjectId('4ed3f18132f50c491100000e')
    ]}
}, function(err, docs){
     console.log(docs);
});
    */

    async validateUser(userDto: UserDTO): Promise<{ accessToken: string } | undefined> {
        let userFind: User = await this.userService.findById(userDto.userId);
        console.log('userFind==login==\n',userFind[0])
        if (userFind[0] === undefined) {
            throw new UnauthorizedException('Please check your ID.')
        }
        console.log('========== login datas ===========')
        //암호화한 db에 있는 hash데이터와 비교
        const validatePassword = await bcrypt.compare(userDto.password, userFind[0].password);
        console.log('=== bcrypt result ===',validatePassword)
        if ( userFind[0]===undefined || !validatePassword ) {
            throw new UnauthorizedException('Please again.');
        } else {
            this.converInAuthorities(userFind[0]);
            // return userFind;
            const payload:Payload = {
                userId: userFind[0].userId,
                username: userFind[0].username, 
                authorities: userFind[0].authorities 
            };
            console.log('=== create login token ===\n',payload)
            // return "Login Success";
            return {
                accessToken: this.jwtService.sign(payload,{secret: process.env.SECRET_KEY})
            };
        }
    }
    //유저 조회
    async tokenValidateUser(payload: Payload): Promise<User | undefined> {
        const userFind = await this.userService.findByFields({
            where: { userId: payload.userId }
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
                console.log('=== converInAuthorities ===',authority)

                authorities.push({name: authority});
            });
            user.authorities = authorities;
            return user;
        }
    }
}
