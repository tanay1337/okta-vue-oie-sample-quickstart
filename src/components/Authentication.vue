<template>
  <div class="authentication">
    <Menu
      @flow="startIdxFlow"
      @logout="handleLogoutOut"
      :authState="authState"
    />

    <Header :meta="meta" :transaction="transaction" />
    <Form
      :authState="authState"
      :inputs="inputs"
      :transaction="transaction"
      @submit="handleSubmit"
      :text="text"
      :image="image"
      :select="select"
      @skip="handleSkip"
      @cancel="handleCancel"
    />

    <Profile :authState="authState" />
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
import { formTransformer } from "@/services/formTransformer";

// Import components
import Menu from "@/components/Menu.vue";
import Profile from "@/components/Profile.vue";
import Header from "@/components/Header.vue";
import Form from "@/components/Form.vue";

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
  components: {
    Menu,
    Profile,
    Header,
    Form,
  },
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
    async handleSubmit(inputValues) {
      const newTransaction = await oktaAuth.idx.proceed(inputValues);
      this.transactionHandler = newTransaction;
      inputValues = {};
      if (newTransaction.status === IdxStatus.SUCCESS) {
        oktaAuth.tokenManager.setTokens(newTransaction.tokens);
        this.authStateHandler = newTransaction.tokens;
      } else if (newTransaction.status === IdxStatus.PENDING) {
        this.formHandling();
      }
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
</style>
