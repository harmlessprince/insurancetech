import { Column, Model, Table, HasMany } from 'sequelize-typescript';
import { Product } from '../../product/entities/product.entity';

@Table
export class Category extends Model {

  @Column
  name: string;

  @Column
  type: string;

  @Column
  slug: string;

  @Column
  price: number;

  @HasMany(() => Product)
  products: Product[];
}
