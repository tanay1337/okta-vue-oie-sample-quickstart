<template>
  <div class="profile" v-show="authState?.idToken">
    <h3>Profile</h3>
    <p>
      Welcome back, <strong>{{ authState?.idToken?.claims?.name }}</strong
      >.
    </p>
  </div>
</template>

<script>
export default {
  name: "Profile",
  props: ["authState"],
};
</script>
