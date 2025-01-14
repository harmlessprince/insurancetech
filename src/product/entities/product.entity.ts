import { Column, Model, Table, HasMany } from 'sequelize-typescript';

@Table
export class Product extends Model {
  @Column
  name: string; // combo of type - category
  @Column
  type: string; //health or auto
}
