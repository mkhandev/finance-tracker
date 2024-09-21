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

  return { user };

  // const fetchUser = () => {
  //   const userData = localStorage.getItem("userData");
  //   if (userData) {
  //     navigateTo("/");
  //   } else {
  //     navigateTo("/login");
  //   }
  // };

  // return { fetchUser };
};
