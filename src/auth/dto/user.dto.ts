import { IsNotEmpty, IsOptional } from "class-validator";

export class UserDTO {
    @IsNotEmpty()
    userId: string;
    @IsOptional()
    username: string;
    @IsNotEmpty()
    password: string;
    @IsOptional()
    authorities?: any[];
}