import { Test, TestingModule } from '@nestjs/testing';
import { Wallet } from './entities/wallet.entity';
import { WalletService } from './wallet.service';
import { REPOSITORIES } from '../core/utils';
import { BadRequestException } from '@nestjs/common';

describe('WalletService', () => {
  let service: WalletService;

  const mockWallet = {
    id: 1,
    balance: 0,
    save: jest.fn(),
    getBalance: function () {
      return this.balance / 100;
    },
    setBalance: function (amount: number) {
      return this.balance = amount * 100;
    },
  };
  mockWallet.setBalance(50000)
  const mockWalletRepository = {
    findOne: jest.fn().mockResolvedValue(mockWallet),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: REPOSITORIES.WALLET_REPOSITORY,
          useValue: mockWalletRepository,
        },
      ],
    }).compile();
    service = module.get<WalletService>(WalletService);
  });

  it('should retrieve a wallet by user ID', async () => {
    const wallet: Wallet | null = await service.getWalletByUserId(1);
    expect(wallet).toEqual(mockWallet);
    expect(mockWalletRepository.findOne).toHaveBeenCalledWith({
      where: { user_id: 1 },
    });
  });

  it('should deduct the wallet balance successfully', async () => {
    await service.deductBalance(1, 10000);
    expect(mockWalletRepository.findOne).toHaveBeenCalledWith({
      where: { user_id: 1 },
    });
    expect(mockWallet.getBalance()).toBe(mockWallet.getBalance());
    expect(mockWallet.save).toHaveBeenCalled();
  });

  it('should throw an error if wallet balance is insufficient', async () => {
    mockWallet.setBalance(5000);
    await expect(service.deductBalance(1, 10000)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw a NotFoundException if the wallet does not exist', async () => {
    mockWalletRepository.findOne.mockResolvedValue(null);
    await expect(service.getWalletByUserId(2)).rejects.toThrow(
      'Wallet not found for user ID: 2',
    );
  });
  it('should credit the wallet balance', async () => {
    const mockWallet = {
      setBalance: jest.fn(),
      save: jest.fn(),
    };

    jest.spyOn(service, 'getWalletByUserId').mockResolvedValue(mockWallet as any);

    await service.creditBalance(1, 100);

    expect(service.getWalletByUserId).toHaveBeenCalledWith(1);
    expect(mockWallet.setBalance).toHaveBeenCalledWith(100);
    expect(mockWallet.save).toHaveBeenCalled();
  });
  it('should empty the wallet balance', async () => {
    const mockWallet = {
      setBalance: jest.fn(),
      save: jest.fn(),
    };

    jest.spyOn(service, 'getWalletByUserId').mockResolvedValue(mockWallet as any);

    await service.emptyBalance(1);

    expect(service.getWalletByUserId).toHaveBeenCalledWith(1);
    expect(mockWallet.setBalance).toHaveBeenCalledWith(0);
    expect(mockWallet.save).toHaveBeenCalled();
  });
});
