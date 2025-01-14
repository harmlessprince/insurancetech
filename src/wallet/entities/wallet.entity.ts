import { BelongsTo, Column, Model, Table } from 'sequelize-typescript';
import { User } from '../../user/entities/user.entity';

@Table
export class Wallet extends Model {
  @Column
  balance: string;
  @BelongsTo(() => User)
  user: User;
}
