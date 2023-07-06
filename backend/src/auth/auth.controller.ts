import { UserService } from './../user/user.service';
import { Body, Controller, Post, BadRequestException, NotFoundException, Res, Req, Get, UseInterceptors, ClassSerializerInterceptor, UseGuards, Param, Delete } from '@nestjs/common';

import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { ApiTags } from '@nestjs/swagger';

import { JwtService } from '@nestjs/jwt';
import { Request, Response, response } from 'express';
import { PassThrough } from 'stream';
import { AuthGuard } from './auth/auth.guard';
import { RegisterDto } from './model/register.dto';
import { LoginDto } from './model/login.dto';
import { ActivateDto } from './model/activate.dto';

const scrypt = promisify(_scrypt);

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
    constructor(
        private userService: UserService,
        private jwtService:JwtService,
        ){

    }
 
    @ApiTags('Auth')    
    @Post('signup')
    async singup(
        @Body() body: RegisterDto
    ){
        if(body.password !== body.password_confirm){
            return new BadRequestException("passwords do not match");
        }
         // See if email is in use
         const findUser = await this.userService.findOne({email:body.email});
         if(findUser){
             throw new BadRequestException('email in use');
            }
            
            //Hash the users password
            // Generate a salt
            const salt = randomBytes(8).toString('hex');
            
            
            // Hash the salt and the passwod together
            const hash = (await scrypt(body.password, salt, 32) as Buffer);
            
            // join the hashed and salt 
            
            const hasedPassword = salt + "." + hash.toString('hex');
            
         
         //Create a new user and save it
         const user = await this.userService.create({
            first_name: body.first_name.toLowerCase(),
            last_name: body.last_name.toLowerCase(),
            email: body.email.toLowerCase(),
            password: hasedPassword
          
         } )

         // return the user
         return user;
        }

         
        //login functionality 
        @ApiTags('Auth') 
        @Post('signin')
        async login(
            @Body() body: LoginDto,
            @Param('deviceId') deviceId: string,
            @Res({passthrough:true}) response: Response,
            @Req() request: Request,
             ){
                const user = await this.userService.findOne({email:body.email});
                
                // checking the user if it's found on the database.
                if(!user){
                    throw new NotFoundException('User not found');
                }
    
                const [salt, storedhash] = user.password.split('.');
    
                const hash = (await scrypt(body.password, salt, 32)) as Buffer;
                
                if (storedhash !== hash.toString('hex')){
                    throw new BadRequestException('Invalid credentials');
                } 
                
                const jwt = await this.jwtService.signAsync({
                    id: user.id,
                    name: user.first_name + ' ' +  user.last_name
                });

                const send_response = response.cookie('jwt', jwt, {httpOnly:true})



                const userAgent = request.headers['user-agent'];
                const addDevice = await this.userService.addDeviceToUser(user.id, deviceId, userAgent);
                return jwt;
            }
    

            @ApiTags('Auth')
            @UseGuards(AuthGuard) 
            @Get('user')
            async user(@Req() request: Request){
                const cookie = request.cookies['jwt'];
                
                const data = await this.jwtService.verifyAsync(cookie);

                const userData = this.userService.findOne({id:data['id']});
                return userData;
            }
            
            @UseGuards(AuthGuard) 
            @ApiTags('Auth')     
            @Post('signout')
            async logout(@Res({passthrough:true}) response: Response){
                response.clearCookie('jwt');
                return{
                    message :'Success'
                }
            }


            // session apis
            @ApiTags('Auth')
            @Post(':userId/devices/:deviceId')
            async addDeviceToUser(
                @Param('userId') userId: number,
                 @Param('deviceId') deviceId: string,
                @Req() request: Request,): Promise<any> {
                const userAgent = request.headers['user-agent'];
                const user = await this.userService.addDeviceToUser(userId, deviceId, userAgent);
                 return { message: 'Device added successfully', user };
  }
  @ApiTags('Auth')
  @Get(':userId/devices')
  async getUserDevices(@Param('userId') userId: number): Promise<{ deviceId: string; userAgent: string }[]> {
    return this.userService.getUserDevices(userId);
  }


  @Delete(':userId/devices/:deviceId')
  async revokeDevice(@Param('userId') userId: number, @Param('deviceId') deviceId: string): Promise<any> {
    const user = await this.userService.revokeDevice(userId, deviceId);
    return { message: 'Device revoked successfully', user };
  }

  @Delete(':userId/devices')
  async revokeAllDevicesExceptCurrent(@Param('userId') userId: number, @Req() request: Request): Promise<any> {
    const deviceId = request.headers['device-id'];
    const user = await this.userService.revokeAllDevicesExceptCurrent(userId, deviceId);
    return { message: 'All devices except the current one revoked successfully', user };
  }

}

