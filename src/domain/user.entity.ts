import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserAuthority } from './user-authority.entity';
//괄호 안에 테이블 명 명시
@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @OneToMany(type => UserAuthority, userAuthority=> userAuthority.user, {eager: true})
    authorities?: any[];
}