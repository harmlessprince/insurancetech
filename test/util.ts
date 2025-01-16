import { Sequelize } from 'sequelize-typescript';

require('dotenv').config();
import fs from 'fs';
import path from 'path';



export const seedDataBase = async  (queryInterface: any, sequelize: any) => {

}

export const dropDatabase = async (queryInterface: any) => {
  await queryInterface.bulkDelete('policies', null, {});
  await queryInterface.bulkDelete('pending_policies', null, {});
  await queryInterface.bulkDelete('plans', null, {});
  await queryInterface.bulkDelete('categories', null, {});
  await queryInterface.bulkDelete('wallets', null, {});
  await queryInterface.bulkDelete('users', null, {});
}
