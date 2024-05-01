import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Todo } from 'src/todos/schemas/Todo.schema';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: [true, "Duplicated email entered"] })
  email: string;

  @Prop()
  password: string;

  @Prop()
  token: string;

  // @Prop({type:[{type:mongoose.Schema.Types.ObjectId, ref:'Todo'}]})
  // user:Todo[]
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo' }] })
  todos: Todo[];
}

export const UserSchema = SchemaFactory.createForClass(User);
