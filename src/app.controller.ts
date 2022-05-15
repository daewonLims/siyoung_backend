import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/api/login')
  getUnityPost(@Req() req:Request,@Res() res:Response): any {
    console.log('cmd= ',req.body.cmd,'\nID= ',req.body.id,'\nUserName= ', req.body.userName);
    //DB접속
    //DB조회
    let isSuccess = false;
    if (isSuccess) {

    }else {
      let res_login = {
        "cmd": 901,
        "message":"login failed"
      };
      let json = JSON.stringify(res_login);
      res.send(json);
    }
  }

  @Get('/')
  getUnityGet(@Req() req:Request,@Res() res:Response): any {
    console.log('Get Response');
    //응답
    //res.send('응답했다');
    res.json({
      cmd: 200,
      message:'안녕하세요'
    });
  }

};

