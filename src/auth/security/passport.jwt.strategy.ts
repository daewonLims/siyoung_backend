import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { AuthService } from '../auth.service';
import { Payload } from "./payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor( private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),//토큰 분석
            ignoreExpiration: true,
            secretOrKey: 'SECRET_KEY',//모듈의 secret과 동일한 값으로 입력
        })
    }

    async validate(payload: Payload, done: VerifiedCallback): Promise<any> {
        const user = await this.authService.tokenValidateUser(payload);
        if ( !user ) {
            return done(new UnauthorizedException({ 
                    message: 'user does not exist'
                }), false );
        } else {
            return done(null, user);
        }
    }
}