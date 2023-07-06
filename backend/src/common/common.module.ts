import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports:[
        JwtModule.register({
            secret: 'Tha23425243ggsr2364!@#$%^&*@#$%^&*(',
            signOptions: { expiresIn: '1w' },
          }),
    ],
    exports:[
        JwtModule
    ]
})
export class CommonModule {}
