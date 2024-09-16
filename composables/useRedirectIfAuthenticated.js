export const useRedirectIfAuthenticated = (url = "/") => {
  const user = useSupabaseUser();

  watch(
    user,
    () => {
      if (user) {
        navigateTo(url);
      }
    },
    { immediate: true }
  );

  return user;
};
