import { IsNotEmpty, IsEmail } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto{
    @ApiProperty({
        type: String,
        description: 'This is a required property',
      })
    @IsNotEmpty()
    first_name: string;
    
    @ApiProperty({
        type: String,
        description: 'This is a required property',
      })
    
    @ApiProperty({
        type: String,
        description: 'This is a required property',
    })
    @IsNotEmpty()
    last_name: string;


    @ApiProperty({
        type: String,
        description: 'This is a required property',
      })
    @IsNotEmpty()
    @IsEmail()
    email: string;
    

    @ApiProperty({
        type: String,
        description: 'This is a required property',
      })
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        type: String,
        description: 'This is a required property',
      })
    @IsNotEmpty()
    password_confirm: string;


      
  
}