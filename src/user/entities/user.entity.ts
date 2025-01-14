
import { Column, Model, Table, HasOne } from 'sequelize-typescript';
import { Wallet } from '../../wallet/entities/wallet.entity';

@Table
export class User extends Model {
  @Column
  username: string;
  @HasOne(() => Wallet)
  wallet: Wallet;
}
