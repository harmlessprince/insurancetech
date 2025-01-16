import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { userProvider } from './user.provider';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';

@Module({
  controllers: [UserController],
  providers: [UserService, ...userProvider],
  exports: [UserService],
  imports: [SequelizeModule.forFeature([User])],
})
export class UserModule {}
