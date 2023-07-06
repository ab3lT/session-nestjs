import { IsNotEmpty, IsEmail } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class ActivateDto{
    @ApiProperty({
        type: String,
        description: 'This email property required',
      })
    @IsNotEmpty()
    email: string;

}