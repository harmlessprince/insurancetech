import { Column, Model, Table, HasOne } from 'sequelize-typescript';
import { Wallet } from '../../wallet/entities/wallet.entity';

@Table
export class Product extends Model {
  @Column
  name: string; // combo of type - category

  @Column
  type: string; //health or auto

}
