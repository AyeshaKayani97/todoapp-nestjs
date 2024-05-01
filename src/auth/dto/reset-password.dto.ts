import { IsNotEmpty, MinLength} from "class-validator";
export class ResetPasswordDTO {
    @IsNotEmpty({ message: 'Password is required.' })
    @MinLength(6, { message: 'Password must be at least 6 characters.' })
    password: string;

    @IsNotEmpty({ message: 'Activation Token is required.' })
    token: string;
}