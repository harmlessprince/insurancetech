'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const products = await queryInterface.sequelize.query(
      `
          SELECT products.*,
                 categories.price AS product_price
          FROM products
                   INNER JOIN
               categories
               ON
                   products.category_id = categories.id
      `,
      {
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    const users = await queryInterface.sequelize.query('SELECT * FROM users', {
      type: Sequelize.QueryTypes.SELECT,
    });
    for (const user of users) {
      console.log("USER ID: ",user.id);
      for (const product of products) {
        console.log("product ID: ",product.id);
        try {
          let plan = {
            user_id: user?.id,
            product_id: product.id,
            price: product?.product_price,
            quantity: Math.floor(Math.random() * (5 - 1 + 1) + 1),
            created_at: new Date(),
            updated_at: new Date(),
          };
          plan.total_price = plan?.price * plan?.quantity;
          await queryInterface.insert(null,"plans", plan)
        } catch (error) {
          if (error.name === 'SequelizeUniqueConstraintError') {
            console.log('Plan has already been purchased');
          } else {
            console.error('Error inserting product:', error);
          }
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('plans', null, {});
  },
};
