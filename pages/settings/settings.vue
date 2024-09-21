<script setup lang="ts">
import { z } from "zod";
import { transactionViewOptions } from "~/constanst";

const { toastSuccess, toastError } = useAppToast();
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const pending = ref(false);

const state = ref({
  transactionView: user.value?.user_metadata?.transaction_view ?? undefined,
});

const schema = z.object({
  transactionView: z.string(),
});

const saveSetting = async () => {
  pending.value = true;

  try {
    const { data, error } = await supabase.auth.updateUser({
      data: { transaction_view: state.value.transactionView },
    });

    if (error) throw error;

    toastSuccess({
      title: "Settings updated",
      description: "Your transaction view has been updated",
    });

  } catch (e) {
    toastError({
      title: "Error updating settings",
      description: e.message,
    });
  } finally {
    pending.value = false;
  }
};
</script>

<template>
  <UForm :state="state" :schema="schema" @submit.prevent="saveSetting">
    <UFormGroup
      name="transactionView"
      label="Transaction View"
      class="mb-4"
      help="Choose how you would like to view transactions"
    >
      <USelect
        v-model="state.transactionView"
        :options="transactionViewOptions"
        placeholder="Select Transaction"
      />

      <template #error>
        <span v-if="state.transactionView === undefined" class="text-red-500">
          Transaction View is required.
        </span>
      </template>
    </UFormGroup>

    <UButton
      type="submit"
      color="black"
      variant="solid"
      label="Save"
      :loading="pending"
      :disabled="pending"
    />
  </UForm>
</template>
