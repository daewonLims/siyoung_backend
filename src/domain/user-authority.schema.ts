import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';

export type UserAuthorityDocument = UserAuthority & Document;

@Schema()
export class UserAuthority {
    
    @Prop()
    userId: string;

    @Prop()
    authorityName: string;

    @Prop({ref:'userModel'})
    user: User;
}

export const UserAuthoritySchema = SchemaFactory.createForClass(UserAuthority);
