<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <Authentication />
  </div>
</template>

<script>
// @ is an alias to /src
import Authentication from "@/components/Authentication.vue";

export default {
  name: "Home",
  components: {
    Authentication,
  },
};
</script>
