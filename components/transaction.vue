<script setup>
const { currency } = useCurrency(3000);

const items = [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => {
        console.log("Edit");
      },
    },
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => console.log("Delete"),
    },
  ],
];
</script>

<template>
  <div
    class="grid grid-cols-2 py-4 border-b border-gray-200 text-gray-900 dark:border-gray-800 dark:text-gray-100"
  >
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-1">
        <UIcon name="i-heroicons-arrow-up-right" class="text-green-600" />
        <div>Salary</div>
      </div>
      <div>Cat</div>
    </div>

    <div class="flex items-center justify-end space-x-2">
      <div>{{ currency }}</div>
      <div>
        <UDropdown :items="items" :popper="{ placement: 'bottom-end' }">
          <UButton
            color="white"
            variant="ghost"
            trailing-icon="i-heroicons-ellipsis-horizontal"
          />
        </UDropdown>
      </div>
    </div>

  </div>
</template>

<style></style>
