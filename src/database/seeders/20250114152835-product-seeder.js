'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = await queryInterface.sequelize.query(
      'SELECT * FROM categories',
      {
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    for (const category of categories) {
      const name = `${category?.type}-${category?.slug}-${category?.price}`;
      try {
        const product = {
          category_id: category?.id,
          name: name,
          type: category?.type,
          created_at: new Date(),
          updated_at: new Date(),
        };
        await queryInterface.insert(null, 'products', product);
      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          console.log(
            'Product  with name already exists: %s',
            name,
          );
        } else {
          console.error('Error inserting product:', error);
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('products', null, {});
  },
};
