import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REPOSITORIES } from '../core/utils';
import { User } from './entities/user.entity';
import { Wallet } from '../wallet/entities/wallet.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(REPOSITORIES.USER_REPOSITORY)
    private readonly userRepository: typeof User,
  ) {}


  async findAll() {
    return await this.userRepository.findAll({
      include: {
        model: Wallet,
      },
    });
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.userRepository.findByPk(id, {
      include: {
        model: Wallet,
      }
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
}
