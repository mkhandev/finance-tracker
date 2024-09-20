<template>
  <UCard>
    <template #header> Signing in... </template>

    Wait a moment while we sign you in...
  </UCard>
</template>

<script setup>
const supabase = useSupabaseClient();

const handleSignIn = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (user) {
    localStorage.setItem("userData", JSON.stringify(user));
    navigateTo('/');
  } else {
    console.error("Error fetching user: ", error);
  }
};

handleSignIn();
</script>
