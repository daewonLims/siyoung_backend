import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
    
    @Prop()
    userId: string;

    @Prop()
    username: string;

    @Prop()
    password: string;

    @Prop()
    authorities?: any[];
}

export const UserSchema = SchemaFactory.createForClass(User);
