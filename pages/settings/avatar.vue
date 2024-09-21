<script setup>
const uploading = ref(false);

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const { url } = useAvatarUrl();

const { toastSuccess, toastError } = useAppToast();
const fileInput = ref();

const saveAvatar = async () => {
  const file = fileInput.value.input.files[0];

  if (!file) {
    toastError({ title: "Select a file to upload first" });
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()}.${fileExt}`;

  try {
    uploading.value = true;
    const currentAvatarUrl = user.value?.user_metadata?.avatar_url;

    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);

    if (error) throw error;

    //console.log(data);

    const { err } = await supabase.auth.updateUser({
      data: { avatar_url: fileName },
    });

    if (err) throw err;

    //Reset the file input
    fileInput.value.input.value = null;

    //remove the old avatar file
    if (currentAvatarUrl) {
      const { data, error } = await supabase.storage
        .from("avatars")
        .remove([currentAvatarUrl]);

      if (error) throw error;
    }

    toastSuccess({
      title: "Avatar uploaded",
    });
  } catch (e) {
    toastError({
      title: "Error uploading avatar",
      description: e.message,
    });
  } finally {
    uploading.value = false;
  }
};

console.log(url.value);
</script>

<template>
  <div>
    <div class="mb-4">
      <UFormGroup
        label="Current avatar"
        class="w-full"
        help="This would be blank by default"
      >
        <UAvatar :src="url" size="3xl" />
      </UFormGroup>
    </div>

    <div class="mb-4">
      <UFormGroup
        label="New avatar"
        class="w-full"
        name="avatar"
        help="After choosing an image click Save to actually upload the new avatar"
      >
        <UInput type="file" ref="fileInput" />
      </UFormGroup>
    </div>

    <UButton
      type="submit"
      color="black"
      variant="solid"
      label="Save"
      :loading="uploading"
      :disabled="uploading"
      @click="saveAvatar"
    />
  </div>
</template>

<style></style>
