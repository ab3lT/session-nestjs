import { IsNotEmpty, IsEmail } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto{
    @ApiProperty({
        type: String,
        description: 'This email property required',
      })
    @IsNotEmpty()
    @IsEmail()
    email: string;
    
    @ApiProperty({
        type: String,
        description: 'This password property required',
      })
    @IsNotEmpty()
    password: string;

 
}