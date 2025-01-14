const path = require('path');
// const { ProductTypes } = require('../utils');

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = [
      {
        name: 'Optimal care mini',
        type: "health",
        price: 10000,
      },
      {
        name: 'Optimal care standard',
        type: "health",
        price: 20000,
      },
      {
        name: 'Third-party',
        type: "auto",
        price: 5000,
      },
      {
        name: 'Comprehensive',
        type: "auto",
        price: 15000,
      },
    ];
    for (const category of categories) {
      try {
        category.slug = category.name.trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
        await queryInterface.insert(null, 'categories', category);
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          console.log('Category  with this slug and type already exists: %s %s', category.name, category.slug);
        } else {
          console.error('Error inserting user:', error);
        }
      }
    }

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
