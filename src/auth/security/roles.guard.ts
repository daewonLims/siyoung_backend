import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { User } from "../../domain/user.entity";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]> ('roles', context.getHandler());

        if ( !roles ) {
            return true;
        } else {
            const request = context.switchToHttp().getRequest();
            const user = request.user as User;

            return user && user.authorities && user.authorities.some(role => roles.includes(role));
        }
    }
}