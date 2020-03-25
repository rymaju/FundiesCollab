<template>
  <div>
    <b-container>
      <h1 class="display-4 mt-5">404: Page Not Found</h1>
      <p
        class="lead"
      >Whoops! Looks like the page you're looking for isnt here! Were you trying to join a room? Double check your URL and try again.</p>

      <router-link to="/">Back to home</router-link>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "NotFound"
};
</script>

<style>
</style>
