import {
  Column,
  Model,
  Table,
  HasOne,
  HasMany,
} from 'sequelize-typescript';
import { Wallet } from '../../wallet/entities/wallet.entity';
import { Plan } from '../../plan/entities/plan.entity';
import { Policy } from '../../policy/entities/policy.entity';
import { PendingPolicy } from '../../pending-policy/entities/pending-policy.entity';

@Table
export class User extends Model {
  @Column
  username: string;

  @Column({
    field: 'created_at',
  })
  createdAt?: Date;

  @Column({
    field: 'updated_at',
  })
  updatedAt?: Date;

  @HasOne(() => Wallet)
  wallet: Wallet;

  @HasMany(() => Plan)
  plans: Plan[];

  @HasMany(() => Policy)
  policies: Policy[];

  @HasMany(() => PendingPolicy)
  pendingPolicies: PendingPolicy[];
}
