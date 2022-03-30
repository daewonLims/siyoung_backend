import { Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Roles } from './decorator/role.decorator';
import { UserDTO } from './dto/user.dto';
import { RoleType } from './role-type';
import { AuthGuard } from './security/auth.guard';
import { RoleGuard } from './security/roles.guard';

@Controller('auth')
export class AuthController {
    constructor( private authService: AuthService ) {}

    //회원가입
    @Post('/register')
    @UsePipes(ValidationPipe)
    async registerAccount( @Body() userDto: UserDTO ): Promise<any> {
        return await this.authService.registerUser(userDto);
    }

    //로그인
    @Post('/login')
    async login(@Body() userDto: UserDTO, @Res() res:Response ): Promise<any> {
        const jwt = await this.authService.validateUser(userDto);
        res.setHeader('Authorization', 'Bearer '+jwt.accessToken);
        //cookie에 저장
        res.cookie('jwt', jwt.accessToken, {
            httpOnly: true,//브라우저에서 사용할 수 없도록 보안 강화
            maxAge: 24 * 60 * 60 * 1000,//하루
        })
        return res.send({
            message: 'access',
        })
    }

    //AuthGuard 라우팅
    @Get('/authenticate')
    @UseGuards(AuthGuard)
    isAuthenticated( @Req() req: Request): any {
        const user: any = req.user;
        return user;
    }

    //admin role check func ADMIN일 경우만 가능
    //권한이 없는 경우 : 403 - error : Forbidden
    @Get('/admin-role')
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(RoleType.ADMIN)
    adminRoleCheck( @Req() req: Request): any {
        const user: any = req.user;
        return user;
    }

    @Get('/cookies')
    getCookies( @Req() req: Request, @Res() res: Response): any {
        const jwt = req.cookies['jwt'];
        return res.send(jwt);
    }

    @Post('/logout')
    logout( @Req() req: Request, @Res() res: Response): any {
        res.cookie('jwt', '', {
            maxAge: 0,
        });
        return res.send({
            message: 'success',
        });
    }
}
