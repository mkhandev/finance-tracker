import { createClient } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker";
import "dotenv/config";

const supabase = createClient(
  process.env.SUPABASE_URL,
  //process.env.SUPABASE_KEY,
  process.env.SERVICE_ROLE_KEY,
  {
    auth: { persistSession: false },
  }
);

const categories = ["Food", "Housing", "Car", "Entertainment"];

const {
  data: { users },
  error,
} = await supabase.auth.admin.listUsers();

const userIds = users.map((user) => {
  return user.id;
});

async function seedTransactions() {
  // Delete existing data
  const { error } = await supabase.from("transactions").delete().gte("id", 0);

  if (error) {
    console.log("Error deleting existing data: ", error);
    return;
  }

  let transactions = [];

  //for user id
  for (const idInfo of userIds) {
    for (
      let year = new Date().getFullYear();
      year > new Date().getFullYear() - 2;
      year--
    ) {
      for (let i = 1; i <= 10; i++) {
        const date = new Date(
          year,
          faker.number.int({ min: 0, max: 11 }),
          faker.number.int({ min: 1, max: 28 })
        );

        let type, category;
        const typeBias = Math.random();

        if (typeBias < 0.85) {
          type = "Expense";
          category = faker.helpers.arrayElement(categories); // Category only for 'Expense'
        } else if (typeBias < 0.95) {
          type = "Income";
        } else {
          type = faker.helpers.arrayElement(["Saving", "Investment"]);
        }

        let amount;

        switch (type) {
          case "Income":
            amount = faker.number.int({ min: 2000, max: 5000 });
            break;

          case "Expense":
            amount = faker.number.int({ min: 100, max: 500 });
            break;

          case "Saving":
            amount = faker.number.int({ min: 50, max: 100 });
            break;

          case "Investment":
            amount = faker.number.int({ min: 5000, max: 10000 });

          default:
            amount = 0;
        }

        transactions.push({
          created_at: date,
          amount,
          type,
          description: faker.lorem.sentence(),
          category: type == "Expense" ? category : null, // Category only for 'Expense'
          user_id: idInfo
        });
      }
    }
  }

  const { error: insertError } = await supabase
    .from("transactions")
    .upsert(transactions);

  if (insertError) {
    console.error("Error inserting data:", insertError);
  } else {
    console.log("Data inserted successfully.");
  }
}

seedTransactions().catch(console.error);
