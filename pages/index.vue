<script setup>
import { transactionViewOptions } from "../constanst";

const selectedView = ref(transactionViewOptions[1]);
const transactions = ref([]);
const isLoading = ref();

const supabase = useSupabaseClient();

const refreshTransactions = async () =>
  (transactions.value = await fetchTransactions());

const fetchTransactions = async () => {
  isLoading.value = true;

  try {
    const { data } = await useAsyncData("transactions", async () => {
      const { data, error } = await supabase.from("transactions").select();
      if (error) return [];
      return data;
    });

    return data.value;
  } finally {
    isLoading.value = false;
  }
};

await refreshTransactions();

const transactionsGroupedByDate = computed(() => {
  let grouped = {};

  for (const transaction of transactions.value) {
    const date = new Date(transaction.created_at).toISOString().split("T")[0];

    if (!grouped[date]) {
      grouped[date] = [];
    }

    grouped[date].push(transaction);
  }

  return grouped;
});

const income = computed(() =>
  transactions.value.filter((inc) => inc.type === "Income")
);
const expense = computed(() =>
  transactions.value.filter((exp) => exp.type === "Expense")
);

const incomeCount = computed(() => income.value.length);
const expenseCount = computed(() => expense.value.length);

const incomeTotal = computed(() =>
  income.value.reduce((sum, trans) => sum + trans.amount, 0)
);
const expenseTotal = computed(() =>
  expense.value.reduce((sum, trans) => sum + trans.amount, 0)
);
</script>

<template>
  <div>
    <section class="flex items-center justify-between mb-10">
      <h1 class="text-4xl font-extrabold">Summary</h1>
      <div>
        <USelect v-model="selectedView" :options="transactionViewOptions" />
      </div>
    </section>

    <section
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10"
    >
      <Trend
        color="green"
        title="Income"
        :amount="incomeTotal"
        :last-amount="3000"
        :loading="isLoading"
      />
      <Trend
        color="red"
        title="Expense"
        :amount="expenseTotal"
        :last-amount="5000"
        :loading="isLoading"
      />
      <Trend
        color="green"
        title="Investments"
        :amount="4000"
        :last-amount="3000"
        :loading="isLoading"
      />
      <Trend
        color="red"
        title="Saving"
        :amount="4000"
        :last-amount="4100"
        :loading="isLoading"
      />
    </section>

    <section class="flex justify-between mb-10">
      <div>
        <h2 class="text-2xl font-extrabold">Transactions</h2>
        <div class="text-gray-500 dark:text-gray-400">
          You have {{ incomeCount }} incomes and {{ expenseCount }} expenses
          this period
        </div>
      </div>
      <div>
        <UButton
          icon="i-heroicons-plus-circle"
          color="white"
          variant="solid"
          label="Add"
        />
      </div>
    </section>

    <section v-if="!isLoading">
      <div
        v-for="(transactionsOnDay, date) in transactionsGroupedByDate"
        :key="date"
        class="mb-10"
      >
        <DailyTransactionSummary
          :date="date"
          :transactions="transactionsOnDay"
        />

        <Transaction
          v-for="transaction in transactionsOnDay"
          :transaction="transaction"
          :key="transaction.id"
          @deleted="refreshTransactions()"
        />
      </div>
    </section>

    <section v-else>
      <USkeleton class="h-5 w-full mb-2" v-for="i in 7" :key="i" />
    </section>
  </div>
</template>

<style></style>
