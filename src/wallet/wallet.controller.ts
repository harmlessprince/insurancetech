import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Wallet } from './entities/wallet.entity';
import { CreditWalletDto } from './dto/credit-wallet.dto';
import { EmptyWalletDto } from './dto/empty-wallet.dto';
import { sendSuccessResponse } from '../core/utils';
import { SuccessResponseDTO } from '../core/responseDTO';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post("/credit")
  @HttpCode(200)
  async credit(@Body() creditWalletDto: CreditWalletDto): Promise<SuccessResponseDTO> {
    const wallet: Wallet = await this.walletService.getWalletByUserId(
      creditWalletDto.userId,
    );
    wallet.setBalance(creditWalletDto.amount + wallet.getBalance());
    await wallet.save();
    return sendSuccessResponse(wallet, "Wallet credited successfully")
  }

  @Post("/empty")
  @HttpCode(200)
  async empty(@Body() emptyWalletDto: EmptyWalletDto):Promise<SuccessResponseDTO>  {
    const wallet: Wallet = await this.walletService.getWalletByUserId(
      emptyWalletDto.userId,
    );
    wallet.setBalance(0);
    await wallet.save();
    return sendSuccessResponse(wallet, "Wallet emptied successfully")
  }
}
