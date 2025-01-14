import { User } from '../../user/entities/user.entity';
import { Column, Model, Table, BelongsTo } from 'sequelize-typescript';
import { Product } from '../../product/entities/product.entity';

@Table
export class Plan extends Model {

  @Column
  price: number;

  @Column
  total_price: number;

  @Column
  quantity: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Product)
  product: Product;
}
