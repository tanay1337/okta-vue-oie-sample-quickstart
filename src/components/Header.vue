<template>
  <div
    class="header"
    v-show="
      transaction?.status !== 'CANCELED' &&
      meta?.flow &&
      transaction?.status !== 'SUCCESS'
    "
  >
    <h3>{{ meta?.flow }} > {{ transaction?.nextStep?.name }}</h3>
    <br />
  </div>
</template>

<script>
export default {
  name: "Header",
  props: ["transaction", "meta"],
};
</script>
