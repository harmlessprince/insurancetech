import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Wallet } from './entities/wallet.entity';
import { REPOSITORIES } from '../core/utils';
import sequelize from 'sequelize';

@Injectable()
export class WalletService {
  constructor(
    @Inject(REPOSITORIES.WALLET_REPOSITORY)
    private readonly walletRepository: typeof Wallet,
  ) {}

  async getWalletByUserId(userId: number): Promise<Wallet> {
    const wallet: Wallet | null = await this.walletRepository.findOne({
      where: { user_id: userId },
    });
    if (!wallet) {
      throw new NotFoundException(`Wallet not found for user ID: ${userId}`);
    }
    return wallet;
  }

  async deductBalance(userId: number, amount: number,  transaction?: sequelize.Transaction|null): Promise<void> {
    const wallet: Wallet = await this.getWalletByUserId(userId);
    if (wallet.getBalance() < amount) {
      throw new BadRequestException('Insufficient balance');
    }
    wallet.setBalance(wallet.getBalance() - amount);
    if (transaction) {
      await wallet.save({ transaction });
    }else {
      await wallet.save();
    }
  }

  async creditBalance(userId: number, amount: number): Promise<void> {
    const wallet: Wallet = await this.getWalletByUserId(userId);
    wallet.setBalance(amount);
    await wallet.save()
  }

  async emptyBalance(userId: number): Promise<void> {
    const wallet: Wallet = await this.getWalletByUserId(userId);
    wallet.setBalance(0);
    await wallet.save()
  }
}
