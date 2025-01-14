import { User } from '../../user/entities/user.entity';
import { Column, Model, Table, BelongsTo, AllowNull } from 'sequelize-typescript';
import { Plan } from '../../plan/entities/plan.entity';
import { Product } from '../../product/entities/product.entity';

@Table
export class Policy extends Model {

  @Column
  @AllowNull(false)
  policy_number: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Product)
  product: Product;

  @BelongsTo(() => Plan)
  plan: Plan;
}
