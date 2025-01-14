'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    for (let i = 1; i < 5; i++) {
      let username = 'user' + i
      try {
        await queryInterface.insert(null, 'users', {
          username: username,
          created_at: new Date(),
          updated_at: new Date(),
        });

        const existingUserId = await queryInterface.rawSelect(
          'users',
          {
            where: { username: username },
            plain: true,
          },
          ['id'],
        );
        await queryInterface.insert(
          null,
          'wallets',
          {
            balance: 100000 * 100,
            user_id: existingUserId,
            created_at: new Date(),
            updated_at: new Date(),
          },
        );

      } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
          console.log('User  with username already exists');
        } else {
          console.error('Error inserting user:', error);
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
