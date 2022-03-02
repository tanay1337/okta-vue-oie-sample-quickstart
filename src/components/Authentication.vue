<template>
  <div class="authentication">
    <button @click="startIdxFlow('authenticate')">Login</button>
    <button @click="startIdxFlow('recoverPassword')">Recover Password</button>
    <button @click="startIdxFlow('register')">Registration</button>
    <button @click="handleLogoutOut" v-show="authState?.idToken">Logout</button>
    <br />
    <br />
    <div class="form" v-show="transaction?.status !== 'CANCELED'">
      <h3 v-show="meta?.flow">
        {{ meta?.flow }} > {{ transaction?.nextStep?.name }}
      </h3>
      <br />
      <form @submit.prevent="handleSubmit" v-if="!authState?.idToken">
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
          <select :name="select.name" @change="handleChange">
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
          <label :name="input.name" :key="index" for="">{{
            input.label
          }}</label>
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
        <button v-show="transaction?.canSkip" @click="handleSkip">Skip</button>
        <button v-show="inputs" type="submit" value="Submit">Submit</button>
        <button v-show="inputs" type="button" @click="handleCancel">
          Cancel
        </button>
      </form>
    </div>

    <div v-show="authState?.idToken">
      <h3>Profile</h3>
      <p>
        Welcome back, <strong>{{ authState?.idToken?.claims?.name }}</strong
        >.
      </p>
    </div>

    <div v-show="transaction?.status === 'CANCELED'">
      <br />
      Transaction has been canceled!
    </div>
  </div>
</template>

<script>
import {
  OktaAuth,
  urlParamsToObject,
  IdxStatus,
  hasErrorInUrl,
} from "@okta/okta-auth-js";
import oidcConfig from "@/config";
import { formTransformer } from "@/formTransformer";

function createOktaAuthInstance() {
  const { state, recoveryToken } = urlParamsToObject(window.location.search);
  return new OktaAuth(
    Object.assign({}, oidcConfig, {
      state,
      recoveryToken,
    })
  );
}

const oktaAuth = createOktaAuthInstance();

export default {
  name: "Authentication",
  setup() {
    const parseFromUrl = async () => {
      try {
        await oktaAuth.idx.handleInteractionCodeRedirect(window.location.href);
        this.$router.push("/");
      } catch (err) {
        console.log(err);
      }
    };

    const updateAuthState = function (authState) {
      this.authStateHandler = authState;
    };

    oktaAuth.authStateManager.subscribe(updateAuthState);
    oktaAuth.start();

    if (hasErrorInUrl(window.location.search)) {
      const url = new URL(window.location.href);
      const error = new Error(
        `${url.searchParams.get("error")}: ${url.searchParams.get(
          "error_description"
        )}`
      );
      this.authStateHandler({ isAuthenticated: false });
      this.transactionHandler = {
        status: IdxStatus.FAILURE,
        error,
      };
      return;
    } else if (oktaAuth.isLoginRedirect()) {
      return parseFromUrl();
    }

    const handleEmailVerifyCallback = async () => {
      try {
        const newTransaction = await oktaAuth.idx.handleEmailVerifyCallback(
          window.location.search
        );
        this.transactionHandler = newTransaction;
      } catch (error) {
        this.transactionHandler = {
          status: IdxStatus.FAILURE,
          error,
        };
      } finally {
        this.$router.push("/");
      }
    };

    if (oktaAuth.idx.isEmailVerifyCallback(window.location.search)) {
      return handleEmailVerifyCallback();
    }

    const resumeTransaction = async () => {
      const newTransaction = await oktaAuth.idx.proceed();
      this.transactionHandler = newTransaction;
    };

    if (oktaAuth.idx.canProceed()) {
      resumeTransaction();
    }
  },
  data() {
    return {
      transaction: {},
      inputValues: {},
      authState: null,
      meta: null,
      inputs: null,
      select: {},
      text: { value: "" },
      image: {},
    };
  },
  computed: {
    transactionHandler: {
      get() {
        return this.transaction;
      },
      set(transaction) {
        this.transaction = transaction;
      },
    },
    authStateHandler: {
      get() {
        return this.authState;
      },
      set(authState) {
        this.authState = authState;
      },
    },
    inputValuesHandler: {
      get() {
        return this.inputValues;
      },
      set(inputValues) {
        this.inputValues = inputValues;
      },
    },
  },
  methods: {
    async startIdxFlow(flowMethod) {
      const newTransaction = await oktaAuth.idx[flowMethod]();
      this.transactionHandler = newTransaction;
      if (newTransaction.status === IdxStatus.SUCCESS) {
        this.authStateHandler = newTransaction.tokens;
      } else {
        this.formHandling();
      }
    },
    formHandling() {
      const form = formTransformer(this.transaction.nextStep)({});
      const { inputs, select, text, image } = form;
      this.meta = oktaAuth.transactionManager.load();
      this.inputs = inputs || {};
      this.select = select || {};
      this.text = text || {};
      this.image = image || {};
    },
    async handleSubmit() {
      const newTransaction = await oktaAuth.idx.proceed(this.inputValues);
      this.transactionHandler = newTransaction;
      this.inputValuesHandler = {};
      if (newTransaction.status === IdxStatus.SUCCESS) {
        oktaAuth.tokenManager.setTokens(newTransaction.tokens);
        this.authStateHandler = newTransaction.tokens;
      } else if (newTransaction.status === IdxStatus.PENDING) {
        this.formHandling();
      }
    },
    handleChange(event) {
      this.inputValues = { authenticator: event.target.value };
    },
    async handleLogoutOut() {
      await oktaAuth.signOut();
    },
    async handleCancel() {
      const newTransaction = await oktaAuth.idx.cancel();
      this.transactionHandler = newTransaction;
    },
    async handleSkip() {
      const newTransaction = await oktaAuth.idx.proceed({ skip: true });
      this.transactionHandler = newTransaction;
    },
  },
};
</script>

<style>
.messages {
  color: red;
}
button {
  background-color: #fff; /* Green */
  border: 2px solid #41b883;
  color: black;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 6px;
  transition-duration: 0.4s;
  cursor: pointer;
}
button:hover {
  background-color: #41b883;
  color: white;
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
