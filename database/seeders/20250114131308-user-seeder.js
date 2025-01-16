'use strict';



const { userSeeder } = require('../../src/core/seeders');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await userSeeder(queryInterface, Sequelize);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
