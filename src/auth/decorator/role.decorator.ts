import { SetMetadata } from "@nestjs/common";
import { RoleType } from "../role-type";

//runtime시에 들어감
export const Roles = (...roles: RoleType[]): any=>SetMetadata('roles', roles);