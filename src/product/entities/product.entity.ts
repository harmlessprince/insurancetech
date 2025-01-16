import {
  Column,
  Model,
  Table,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Category } from '../../category/entities/category.entity';

@Table
export class Product extends Model {
  @Column({
    allowNull: false,
  })
  name: string; // combo of type - category
  @Column({
    allowNull: false,
  })
  type: string; //health or auto

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

  @ForeignKey(() => Category) // Define the foreign key
  @Column({
    allowNull: false,
    field: 'category_id',
  })
  categoryId: number;

  @BelongsTo(() => Category)
  category: Category;
}
