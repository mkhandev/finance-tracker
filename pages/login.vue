<script setup>
const success = ref(false);
const email = ref("");
const pending = ref(false);
const supabase = useSupabaseClient();
const { toastSuccess, toastError } = useAppToast();
const redirectUrl = useRuntimeConfig().public.baseUrl

//check login
//const { fetchUser } = useRedirectIfAuthenticated();
//useRedirectIfAuthenticated();

const handelLogin = async () => {
  pending.value = true;
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: `${redirectUrl}/confirm`,
      },
    });

    if(error) throw error;

    success.value = true

  } catch (e) {
    toastError({
      title: 'Error authenticating',
      description: e.message,
    });
  } finally {
    pending.value = false;
  }
};

// onMounted(() => {
//   fetchUser();
// });
</script>

<template>
  <UCard v-if="!success">
    <template #header> Sign-in to Finance Tracker </template>

    <UForm @submit.prevent="handelLogin">
      <UFormGroup label="Email" name="email" class="mb-4" :required="true">
        <UInput v-model="email" type="email" placeholder="Email" required />
      </UFormGroup>

      <UButton type="submit" variant="solid" color="black" :loading="pending"
        >Sign-in</UButton
      >
    </UForm>
  </UCard>

  <UCard v-else>
    <template #header> Email has been sent </template>

    <div class="text-center">
      <p class="mb-4">
        We have sent an email to <strong>rmsil@email.com</strong> with a link to
        sign-in.
      </p>
      <p><strong>Important:</strong> The link will expire in 5 minutes.</p>
    </div>
  </UCard>
</template>
