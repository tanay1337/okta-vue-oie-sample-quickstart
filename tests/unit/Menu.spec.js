import { shallowMount } from "@vue/test-utils";
import Menu from "@/components/Menu.vue";

describe("Menu.vue", () => {
  it("when authState is not set, logout button is not visible", () => {
    const authState = {}
    const wrapper = shallowMount(Menu, {
      props: { authState },
    });
    
    const loginButton = wrapper.find('[data-testid="login-button"]');
    const recoverPasswordButton = wrapper.find('[data-testid="recover-password-button"]');
    const registerButton = wrapper.find('[data-testid="register-button"]');
    const logoutButton = wrapper.find('[data-testid="logout-button"]');

    expect(loginButton.isVisible()).toBe(true)
    expect(recoverPasswordButton.isVisible()).toBe(true)
    expect(registerButton.isVisible()).toBe(true)
    expect(logoutButton.isVisible()).toBe(false);
  });

  it("when authState and idToken are set, only logout button is visible", () => {
    const authState = {
      idToken: 'anIdToken'
    }
    const wrapper = shallowMount(Menu, {
      props: { authState },
    });
    
    const loginButton = wrapper.find('[data-testid="login-button"]');
    const recoverPasswordButton = wrapper.find('[data-testid="recover-password-button"]');
    const registerButton = wrapper.find('[data-testid="register-button"]');
    const logoutButton = wrapper.find('[data-testid="logout-button"]');

    expect(loginButton.isVisible()).toBe(false)
    expect(recoverPasswordButton.isVisible()).toBe(false)
    expect(registerButton.isVisible()).toBe(false)
    expect(logoutButton.isVisible()).toBe(true);
  });
});
