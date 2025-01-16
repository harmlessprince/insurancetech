'use strict';

const { pendPolicySeeder } = require('../../src/core/seeders');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await  pendPolicySeeder(queryInterface, Sequelize);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('pending_policies', null, {});
  },
};
