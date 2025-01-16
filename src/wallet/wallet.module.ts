import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { walletProvider } from './wallet.provider';
import { SequelizeModule } from '@nestjs/sequelize';
import { Wallet } from './entities/wallet.entity';

@Module({
  controllers: [WalletController],
  providers: [WalletService, ...walletProvider],
  exports: [WalletService],
  imports: [SequelizeModule.forFeature([Wallet])],
})
export class WalletModule {}
