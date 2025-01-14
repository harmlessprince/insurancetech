import { User } from '../../user/entities/user.entity';
import { Column, Model, Table, BelongsTo } from 'sequelize-typescript';
import { Plan } from '../../plan/entities/plan.entity';

@Table
export class PendingPolicy extends Model {
  @Column
  status: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Plan)
  plan: Plan;
}
