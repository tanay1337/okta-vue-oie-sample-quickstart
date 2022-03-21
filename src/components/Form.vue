<template>
  <div
    class="form"
    v-show="transaction?.status !== 'CANCELED' && !authState?.idToken"
  >
    <form @submit.prevent="submit">
      <div
        class="messages"
        v-for="(message, index) in transaction.messages"
        :key="index"
        v-show="transaction.messages"
      >
        {{ message.message }}
      </div>
      <div v-show="text.value">{{ text }}</div>
      <img v-show="image?.src" :src="image.src" />
      <div v-show="select?.name">
        <label>{{ select.label }}</label>
        <select :name="select.name" @change="change">
          <option key="" value="">---</option>
          <option
            v-for="option in select.options"
            :key="option.key"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <div v-for="(input, index) in inputs" :key="index">
        <label :name="input.name" :key="index" for="">{{ input.label }}</label>
        <input
          :name="input.name"
          :key="index"
          :type="input.type"
          :required="input.required"
          v-model="inputValues[input.name]"
        />
      </div>

      <br />
      <br />
      <button v-show="transaction?.canSkip" @click="skip">Skip</button>
      <button v-show="inputs" type="submit" value="Submit">Submit</button>
      <button v-show="inputs" type="button" @click="cancel">Cancel</button>
    </form>
  </div>

  <div v-show="transaction?.status === 'CANCELED'">
    <br />
    Transaction has been canceled!
  </div>
</template>

<script>
export default {
  name: "Form",
  props: ["authState", "transaction", "inputs", "text", "image", "select"],
  emits: ["submit", "skip", "cancel", "change"],
  data() {
    return {
      inputValues: {},
    };
  },
  methods: {
    submit() {
      return this.$emit("submit", this.inputValues);
    },
    skip() {
      return this.$emit("skip");
    },
    cancel() {
      return this.$emit("cancel");
    },
    change(event) {
      this.inputValues[event.target.name] = event.target.value;
    },
  },
};
</script>

<style>
.messages {
  color: red;
}
input {
  padding: 8px 16px;
  margin: 8px 0;
  box-sizing: border-box;
}
label {
  width: 100px;
  margin-right: 15px;
}
</style>
