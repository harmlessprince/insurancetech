import { Column, Model, Table, HasMany } from 'sequelize-typescript';
import { Product } from '../../product/entities/product.entity';

@Table({
  timestamps: true,
})
export class Category extends Model {

  @Column({
    allowNull: false,
  })
  name: string;

  @Column({
    allowNull: false,
  })
  type: string;

  @Column({
    allowNull: false,
  })
  slug: string;

  @Column({
    allowNull: false,
  })
  price: number;

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

  @HasMany(() => Product)
  products: Product[];
}
