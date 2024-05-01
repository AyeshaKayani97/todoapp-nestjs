import { Body, Injectable, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {User } from 'src/auth/schemas/user.schema';
import { CreateTodoDto } from './dto/create.dto';
import { updateTodoDto } from './dto/updateTodo.dto';
import { Todo } from './schemas/Todo.schema';

@Injectable()
export class TodosService {
    constructor(
        @InjectModel(Todo.name)
        private TodoModel:Model<Todo>

    ){}

    async findAll():Promise<Todo[]>{
        const todo = await this.TodoModel.find()
        return todo
    }

    async getTodoById(id:string){
        const user = await this.TodoModel.findById(id)
        return user;
    }

    async createTodo(createTodoDto: CreateTodoDto, user: User) {
        const data = Object.assign(createTodoDto, {
            user: user._id
        });
        const res = await this.TodoModel.create(data);
        return res;
    }

 
    

    // update todo 

    async updateToDo(id:string, updateTodoDto:updateTodoDto ){

        const updateTodo =  this.TodoModel.findByIdAndUpdate(id,updateTodoDto, {new:true} )
        return  updateTodo;

    }

    async deleteTodo(id:string){

        const deleteUser = await this.TodoModel.findByIdAndDelete(id);
        return deleteUser
    }
}
