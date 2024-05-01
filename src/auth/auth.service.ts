import { Body, Injectable, Param, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {  Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { SignUpDto } from './dto/signup.dto';
import { LogInDTO } from './dto/signin.dto';
import * as bcrypt from "bcryptjs";
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
         private authModel : Model<User>,
         private jwtService:JwtService,
         private configService:ConfigService,
         private readonly mailService: MailerService
    ){}

    async signUp(signUpDto:SignUpDto):Promise<{token:string}>{
        const {name, email, password} = signUpDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.authModel.create({
            name,
            password: hashedPassword,
            email


        })
        const token = this.jwtService.sign({id:user._id})
        return {token}



    }


    async login(loginDto:LogInDTO):Promise<{token:string}>{
        const {email, password} = loginDto
        const user = await this.authModel.findOne({email})
        if(!user){
            throw new  UnauthorizedException("Invalid email or password")

        }
        const isPasswordMatched = await bcrypt.compare(password, user.password)

        if(!isPasswordMatched){
            throw new  UnauthorizedException("Invalid email or password")

        }

        const token = this.jwtService.sign({id:user._id})
            return { token}
        

    }

    async forgotPasswordEmail(name, email, token){
        const mailOptions = {
            from:this.configService.get<string>("EMAIL_USERNAME"),
            to: email, // list of receivers
            subject: "For reset password ✔", 
            // text: "Hello world?", 
            html: 'Hi ' +name+ ', please copy the link <a href="http://127.0.0.1:3000/auth/reset-password?token= '+token+'" >reset password</a> ', 
        }
        await this.mailService.sendMail(mailOptions);


    }

    
    async forgotPassword(forgotPasswordDTO: ForgotPasswordDTO) {
        const { email } = forgotPasswordDTO;
        const user = await this.authModel.findOne({ email });
        
        if (user) {
            const randomToken = uuidv4();
            await this.authModel.updateOne({ email: email }, { $set: { token: randomToken } });
            await this.forgotPasswordEmail(user.name, user.email, randomToken);
            
            // Success message after sending the email
            return {
                "message":"Reset password email has been sent. Please check your inbox."
            };
        } else {
            throw new UnauthorizedException("This Email Does Not Exist");
        }
    }

    // reset password 


    async resetPassword(resetPasswordDTO: ResetPasswordDTO) {
        const { token, password } = resetPasswordDTO;
        const tokenData = await this.authModel.findOne({ token: token });
    
        if (tokenData) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await this.authModel.findByIdAndUpdate(tokenData._id, { $set: { password: hashedPassword, token: "" } }, { new: true });
            
            return {
                message: "User Password has been reset"
            };
        } else {
            throw new UnauthorizedException("This link has expired");
        }
    }
    
   
    // protecting routes from unauthenticated user 

    async findUserByid(id:string){
        const user = await this.authModel.findById(id);
        // const {password, ...others} = user.toObject();
        return user;

    }


    
}
