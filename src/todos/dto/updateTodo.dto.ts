import { IsNotEmpty, IsString, IsEmpty } from "class-validator";
import { User } from "src/auth/schemas/user.schema";

export class updateTodoDto{

    @IsString()
    @IsNotEmpty()
    title:string


   
    @IsEmpty({message:"you can not pass id"})
    user:User
} 