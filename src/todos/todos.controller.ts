import { Controller, Post, Body, Delete, Param, Patch, Get, HttpException, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { CreateTodoDto } from './dto/create.dto';
import { TodosService } from './todos.service';
import mongoose from 'mongoose';
import { updateTodoDto } from './dto/updateTodo.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from 'src/auth/jwt.guard';
import { Todo } from './schemas/Todo.schema';

@Controller('todos')
export class TodosController {
    constructor(
       private  todoService:TodosService
    ){}

    @Get()
    getAllToDos(){
        return this.todoService.findAll();

    }

 
    @Post()
    @UseGuards(JwtGuard)
    createTodo(
        @Body() createTodoDto: CreateTodoDto,
        @Req() req,
    ) {
        return this.todoService.createTodo(createTodoDto, req.user);
    }
    @Patch(":id")
    @UseGuards(JwtGuard)
    updateTodo(@Param("id") id:string, @Body() updateTodoDto:updateTodoDto){
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) {
          throw new HttpException("Invalid ID", HttpStatus.NOT_FOUND);
        }
        const updateTodo = this.todoService.updateToDo(id, updateTodoDto);
        if(!updateTodo){
            throw new HttpException("No user found", HttpStatus.NOT_FOUND);

        }
        return updateTodo

    }

    @Delete(":id")
    deleteTodod(@Param() id:string){
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) {
          throw new HttpException("Invalid ID", HttpStatus.NOT_FOUND);
        }
        const deleteUser =  this.todoService.deleteTodo(id);
        if(!deleteUser){
            throw new HttpException("No todo found with this id",  HttpStatus.NOT_FOUND);

        }
        return deleteUser;

    }


}
