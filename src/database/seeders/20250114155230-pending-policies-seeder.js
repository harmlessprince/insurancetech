'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const plans = await queryInterface.sequelize.query(
      `SELECT *
       FROM plans`,
      {
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    const options = ['used', 'unused'];
    for (const plan of plans) {
      const randomChoice = options[Math.floor(Math.random() * options.length)];
      const item = {
        plan_id: plan?.id,
        user_id: plan?.user_id,
        status: randomChoice,
        created_at: new Date(),
        updated_at: new Date(),
      };
      await queryInterface.insert(null, 'pending_policies', item);
    }
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
