import { format, addDays } from "date-fns";
import { ref, computed, watch } from "vue"; // Ensure you are importing required functions

export const useFetchTransactions = (period) => {
  const supabase = useSupabaseClient(); // Assuming you have Supabase set up
  const transactions = ref([]); // Reactive variable to store transactions
  const pending = ref(false); // Reactive variable for loading state

  // Computed properties for income and expense transactions
  const income = computed(() =>
    transactions.value.filter((t) => t.type === "Income")
  );

  const expense = computed(() =>
    transactions.value.filter((t) => t.type === "Expense")
  );

  // Count the number of income and expense transactions
  const incomeCount = computed(() => income.value.length);
  const expenseCount = computed(() => expense.value.length);

  // Total amounts for income and expense transactions
  const incomeTotal = computed(() => {
    const total = income.value.reduce((sum, transaction) => sum + transaction.amount, 0);
    console.log("Income Total Updated:", total); // Debugging output
    return total;
  });

  const expenseTotal = computed(() => {
    const total = expense.value.reduce((sum, transaction) => sum + transaction.amount, 0);
    console.log("Expense Total Updated:", total); // Debugging output
    return total;
  });

  // Fetch transactions based on the selected period
  const fetchTransactions = async () => {
    pending.value = true;

    try {
      const { data, error } = await supabase
        .from("transactions")
        .select()
        .gte("created_at::date", format(period.value.from, "yyyy-MM-dd"))
        .lt(
          "created_at::date",
          format(addDays(period.value.to, 1), "yyyy-MM-dd")
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
        return [];
      }

      return data; // Return the fetched data
    } catch (error) {
      console.error("Unexpected error fetching transactions:", error);
      return [];
    } finally {
      pending.value = false; // Stop loading state
    }
  };

  // Refresh function to update transactions
  const refresh = async () => {
    transactions.value = await fetchTransactions(); // Update the transactions array
  };

  // Watch the `period` for changes and refresh the data when it changes
  watch(
    period,
    async () => {
      console.log("Period changed:", period.value); // Debugging statement
      await refresh(); // Refresh data when the period changes
    },
    { immediate: true } // Immediate flag to fetch transactions on initial load
  );

  // Group transactions by their creation date
  const transactionsGroupedByDate = computed(() => {
    let grouped = {};

    for (const transaction of transactions.value) {
      const date = transaction.created_at.split("T")[0]; // Extract the date part

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(transaction); // Add transaction to its date group
    }

    return grouped;
  });

  // Return the relevant data and functions from the composable
  return {
    transactions: {
      all: transactions,
      grouped: {
        byDate: transactionsGroupedByDate, // Grouped transactions by date
      },
      income, // Computed income transactions
      expense, // Computed expense transactions
      incomeTotal, // Computed income total
      expenseTotal, // Computed expense total
      incomeCount, // Count of income transactions
      expenseCount, // Count of expense transactions
    },
    refresh, // Function to refresh data
    pending, // Loading state
  };
};
