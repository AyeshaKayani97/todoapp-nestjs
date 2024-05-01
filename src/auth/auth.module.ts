import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule and ConfigService
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule
      inject: [ConfigService], // Inject ConfigService
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'), // Fix typo and use get method to fetch value from environment variables
          signOptions: {
            expiresIn: config.get<string>('JWT_EXPIRE'), // Fix typo and use get method
          },
        };
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: 587, // or 465 for SSL
        secure: false, // true for SSL, false for TLS/STARTTLS
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // Add comma here
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports:[JwtStrategy, PassportModule]
})
export class AuthModule {}
