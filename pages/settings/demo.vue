<script setup>
import { ref } from "vue";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  gender: z.enum(["Male", "Female", "Other"], "Gender is required"),
});

const formData = ref({
  name: "",
  gender: "",
});

const errors = ref({});

const validateForm = () => {
  const result = schema.safeParse(formData.value);
  if (!result.success) {
    errors.value = result.error.issues.reduce((acc, issue) => {
      acc[issue.path[0]] = issue.message;
      return acc;
    }, {});
  } else {
    errors.value = {};
    console.log("Validation successful", result.data);
  }
};
</script>

<template>
  <form
    :state="formData"
    :schema="schema"
    ref="form"
    @submit.prevent="validateForm"
  >

    <div>
      <label for="name">Name</label>
      <input v-model="formData.name" id="name" type="name" />
      <p v-if="errors.name">{{ errors.email }}</p>
    </div>

    <div>
      <label for="gender">Gender</label>
      <select v-model="formData.gender" id="gender">
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <p v-if="errors.gender">{{ errors.gender }}</p>
    </div>

    <button type="submit">Submit</button>
  </form>
</template>
