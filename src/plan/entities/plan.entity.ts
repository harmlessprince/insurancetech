import { User } from '../../user/entities/user.entity';
import { Column, Model, Table, BelongsTo, ForeignKey, HasMany } from 'sequelize-typescript';
import { Product } from '../../product/entities/product.entity';
import { PendingPolicy } from '../../pending-policy/entities/pending-policy.entity';

@Table({
  timestamps: true,
})
export class Plan extends Model {

  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({
    allowNull: false,
  })
  price: number;

  @Column({
    allowNull: false,
    field: 'total_price',
  })
  totalPrice: number;

  @Column({
    allowNull: false,
    field: 'quantity',
  })
  quantity: number;


  @ForeignKey(() => User)
  @Column({
    allowNull: false,
    field: 'user_id',
  })
  userId: number;

  @ForeignKey(() => Product)
  @Column({
    allowNull: false,
    field: 'product_id',
  })
  productId: number;

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

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Product)
  product: Product;

  @HasMany(() => PendingPolicy)
  pendingPolicies: PendingPolicy[];
}
