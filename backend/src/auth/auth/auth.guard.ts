import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService:JwtService){}
  canActivate(
    context: ExecutionContext,
  ) {
    const request = context.switchToHttp().getRequest();
    try{
      const jwt = request.cookies.jwt;
      return this.jwtService.verify(jwt);
    }catch(e){
      console.log(e.message);
      return false;
    }
  }
}
