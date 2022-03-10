<template>
  <div class="menu">
    <button @click="selectFlow('authenticate')" v-show="!authState?.idToken">
      Login
    </button>
    <button @click="selectFlow('recoverPassword')" v-show="!authState?.idToken">
      Recover Password
    </button>
    <button @click="selectFlow('register')" v-show="!authState?.idToken">
      Registration
    </button>
    <button @click="logout" v-show="authState?.idToken">Logout</button>
    <br />
    <br />
  </div>
</template>

<script>
export default {
  name: "Menu",
  props: ["authState"],
  emits: ["flow", "logout"],
  methods: {
    selectFlow(flow) {
      return this.$emit("flow", flow);
    },
    logout() {
      return this.$emit("logout");
    },
  },
};
</script>
