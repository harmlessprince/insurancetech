'use strict';

const { planSeeder } = require('../../src/core/seeders');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await  planSeeder(queryInterface, Sequelize);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('plans', null, {});
  },
};
