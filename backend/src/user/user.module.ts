import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './model/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
  exports:[UserService, UserModule ]
})
export class UserModule {}
