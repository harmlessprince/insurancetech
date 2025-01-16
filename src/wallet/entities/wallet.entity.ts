import { AllowNull, BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../../user/entities/user.entity';

@Table
export class Wallet extends Model {


  @Column({
    allowNull: false,
  })
  private balance: number;

  @Column({
    field: 'created_at',
  })
  createdAt?: Date;

  @Column({
    field: 'updated_at',
  })
  updatedAt?: Date;

  @ForeignKey(() => User)
  @Column({field: 'user_id'})
  userId: number;

  @BelongsTo(() => User)
  user: User;

  getBalance(): number {
    return this.balance / 100;
  }

  // saving balance in small unit (kobo)
  setBalance(balance: number): void {
    this.balance = balance * 100;
  }
}
