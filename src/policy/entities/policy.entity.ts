import { User } from '../../user/entities/user.entity';
import { Column, Model, Table, BelongsTo, AllowNull, ForeignKey } from 'sequelize-typescript';
import { Plan } from '../../plan/entities/plan.entity';
import { Product } from '../../product/entities/product.entity';

@Table
export class Policy extends Model {

  @Column({
    allowNull: false,
  })
  policy_number: string;

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

  @ForeignKey(() => User)
  @Column({
    allowNull: false,
  })
  user_id: number;

  @ForeignKey(() => Product)
  @Column({
    allowNull: false,
  })
  product_id: number;


  @ForeignKey(() => Plan)
  @Column({
    allowNull: false,
  })
  plan_id: number;


  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Product)
  product: Product;

  @BelongsTo(() => Plan)
  plan: Plan;
}
