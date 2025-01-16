import { REPOSITORIES } from '../core/utils';
import { Wallet } from './entities/wallet.entity';

export const walletProvider = [
  {
    provide: REPOSITORIES.WALLET_REPOSITORY,
    useValue: Wallet,
  },
];
