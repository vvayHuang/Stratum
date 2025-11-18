export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();

  if (!user.value) {
    // If user is not logged in, redirect to the homepage
    return navigateTo('/');
  }
});