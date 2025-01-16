import { User } from '../../user/entities/user.entity';
import {
  Column,
  Model,
  Table,
  BelongsTo,
  ForeignKey,
  AllowNull, DefaultScope,
} from 'sequelize-typescript';
import { Plan } from '../../plan/entities/plan.entity';


@DefaultScope(() => ({
  where: { deleted_at: null }, // Default scope to exclude soft-deleted records
}))
@Table({
  tableName: 'pending_policies',
  timestamps: true,
  paranoid: true,
})
export class PendingPolicy extends Model {
  @Column({
    allowNull: false,
  })
  status: string;

  @ForeignKey(() => Plan)
  @Column({
    allowNull: false,
    field: 'plan_id',
  })
  planId: number;

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    field: 'user_id',
  })
  userId: number;

  @Column({
    field: 'created_at',
    allowNull: false,
  })
  createdAt?: Date;

  @Column({
    field: 'updated_at',
    allowNull: false,
  })
  updatedAt?: Date;

  @Column({
    field: 'deleted_at',
    allowNull: true,
  })
  deletedAt?: Date;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Plan)
  plan: Plan;
}
