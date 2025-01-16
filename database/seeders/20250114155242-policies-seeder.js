'use strict';

const { policySeeder } = require('../../src/core/seeders');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await policySeeder(queryInterface, Sequelize);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('policies', null, {})
  }
};
