import { User } from "./model/user.entity";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ){
        
       
    }

    // To return all the users
    async all(): Promise<User[]>{
        return await this.userRepository.find();
    }

    // To Create user
    async create(data): Promise<any>{
        return this.userRepository.save(data)
    }

     // To find user by Condition
     async findOne(condition, relations: any[] = []):Promise<any>{
        return this.userRepository.findOne({where: condition,relations});
    }

     // To find user by id
     async findOneById(id:number):Promise<any>{
        return this.userRepository.findOneBy({id: id});
    }
     // To find user by id
     async update(id:number, options:any):Promise<any>{
        return this.userRepository.update(id, options);
    }

    async addDeviceToUser(userId: number, deviceId: string, userAgent: string): Promise<User> {
        const user = await this.userRepository.findOne({where:{id:userId}});
        if (!user) {
          throw new Error('User not found');
        }
    
        const device = { deviceId, userAgent, lastLoggedIn: new Date() };
        user.devices = user.devices || [];
        user.devices.push(device);
        await this.userRepository.save(user);
        return user;
      }
    
      async getUserDevices(userId: number): Promise<{ deviceId: string; userAgent: string }[]> {
        const user = await this.userRepository.findOne({where:{id:userId}});
        if (!user) {
          throw new Error('User not found');
        }
    
        return user.devices.map((device) => ({
          deviceId: device.deviceId,
          userAgent: device.userAgent,
        }));
      }
    
      async revokeDevice(userId: number, deviceId: string): Promise<User> {
        const user = await this.userRepository.findOne({where:{id:userId}});
        if (!user) {
          throw new Error('User not found');
        }
    
        user.devices = user.devices.filter((device) => device.deviceId !== deviceId);
        await this.userRepository.save(user);
        return user;
      }
    
      async revokeAllDevicesExceptCurrent(userId: any, deviceId: any): Promise<User> {
        const user = await this.userRepository.findOne({where:{id:userId}});
        if (!user) {
          throw new Error('User not found');
        }
    
        user.devices = user.devices.filter((device) => device.deviceId === deviceId);
        await this.userRepository.save(user);
        return user;
      }

      


    
}
