import { IsEmpty, IsNotEmpty, IsString } from "class-validator";
import { User } from "src/auth/schemas/user.schema";

export class CreateTodoDto{

    @IsNotEmpty()
    @IsString()
    title:string


    @IsEmpty({message:"you can not pass user id"})
    user:User

    
}