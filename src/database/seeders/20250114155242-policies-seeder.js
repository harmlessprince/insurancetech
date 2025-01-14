'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const pending_policies = await queryInterface.sequelize.query(
      `SELECT pending_policies.*, plans.product_id as product_id
       FROM pending_policies 
       LEFT JOIN plans ON pending_policies.plan_id = plans.id
       WHERE status = 'used'`,
      {
        type: Sequelize.QueryTypes.SELECT,
      },
    );
    for (const pending of pending_policies) {
      const item = {
        plan_id: pending?.plan_id,
        product_id: pending?.product_id,
        user_id: pending?.user_id,
        policy_number: `PLO-2025-JAN-15-PL-${pending?.plan_id}-PR-${pending?.product_id}-USR-${pending?.user_id}`,
        created_at: new Date(),
        updated_at: new Date(),
      };
      await queryInterface.insert(null, 'policies', item);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('policies', null, {})
  }
};
