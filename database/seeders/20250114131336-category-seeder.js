const path = require('path');
const { categorySeeder } = require('../../src/core/seeders');
// const { ProductTypes } = require('../utils');

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await categorySeeder(queryInterface, Sequelize);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
