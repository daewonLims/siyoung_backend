import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
/**
 * handler Route로 넘어가기 전에 서버 모듈 전에 전처리 해주는 부분을 
 * NestJS에서 미들웨어로 사용
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use( req: Request, res: Response, next: NextFunction ) {
        console.log('Request...',req,'\n=============\n',res);
        next();
    }
}