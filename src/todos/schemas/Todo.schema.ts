import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';



@Schema({ timestamps: true })
export class Todo   extends Document{
  @Prop({required:true})
  title: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User; 


}


export const TodoSchema = SchemaFactory.createForClass(Todo);
