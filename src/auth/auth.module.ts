import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserRepository } from './repository/user.repository';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './security/passport.jwt.strategy';
// import { UserAuthorityRepository } from './repository/user-authority.repository';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../domain/user.schema';
import { UserAuthority, UserAuthoritySchema } from '../domain/user-authority.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{name:User.name, schema:UserSchema},{name:UserAuthority.name, schema:UserAuthoritySchema}]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: {expiresIn: '300s'},
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy]
})
export class AuthModule {}
