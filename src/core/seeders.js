const userSeeder = async (queryInterface, Sequelize) => {
  let existingUserId = 0
  for (let i = 1; i < 5; i++) {
    let username = 'user' + i
    try {
      await queryInterface.insert(null, 'users', {
        username: username,
        created_at: new Date(),
        updated_at: new Date(),
      });

      existingUserId = await queryInterface.rawSelect(
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
          balance: 200000 * 100,
          user_id: existingUserId,
          created_at: new Date(),
          updated_at: new Date(),
        },
      );

    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        console.log('User  with username already exists');
        await queryInterface.bulkUpdate(
          'wallets',
          {
            balance: 200000 * 100,
            updated_at: new Date(),
          },
          {
            user_id: existingUserId, // Condition to identify the wallet to update
          }
        );
      } else {
        console.error('Error inserting user:', error);
      }
    }
  }
}

creditWalletSeeder = async (queryInterface, Sequelize) => {
  await queryInterface.bulkUpdate(
    'wallets',
    {
      balance: 200000 * 100,
      updated_at: new Date(),
    },
  );
}

categorySeeder = async (queryInterface, Sequelize) => {
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
      category.created_at = new Date();
      category.updated_at = new Date();
      await queryInterface.insert(null, 'categories', category);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        console.log('Category  with this slug and type already exists: %s %s', category.name, category.slug);
      } else {
        console.error('Error inserting user:', error);
      }
    }
  }
}



productSeeder = async (queryInterface, Sequelize) => {
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
}
planSeeder = async (queryInterface, Sequelize) => {
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
    for (const product of products) {
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
}
pendPolicySeeder = async (queryInterface, Sequelize) => {
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
      deleted_at: null,
    };
    if (randomChoice === 'used') {
      item.deleted_at = new Date();
    }
    await queryInterface.insert(null, 'pending_policies', item);
  }
}
policySeeder = async (queryInterface, Sequelize) => {
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
}

dropTables = async (queryInterface, Sequelize) => {
  const tables = [
    "policies",
    "pending_policies",
    "plans",
    "products",
    "wallets",
    "categories",
    "users",
  ];
  for (const table of tables) {
    await queryInterface.dropTable(table);
  }
}

refreshDatabase = async (queryInterface, Sequelize) => {
  try {
    await userSeeder(queryInterface, Sequelize);
    await categorySeeder(queryInterface, Sequelize);
    await productSeeder(queryInterface, Sequelize);
    await planSeeder(queryInterface, Sequelize);
    await pendPolicySeeder(queryInterface, Sequelize);
    await policySeeder(queryInterface, Sequelize);
  }catch(error) {
    console.log("Seeder", error);
  }

}




module.exports = {
  userSeeder,
  categorySeeder,
  productSeeder,
  planSeeder,
  pendPolicySeeder,
  policySeeder,
  refreshDatabase,
  creditWalletSeeder,
}