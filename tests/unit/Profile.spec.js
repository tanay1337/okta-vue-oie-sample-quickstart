import { shallowMount } from "@vue/test-utils";
import Profile from "@/components/Profile.vue";

describe("Profile.vue", () => {
  it("don't show the profile section if authState is not set", () => {
    const authState = {};
    const wrapper = shallowMount(Profile, {
      props: { authState },
    });

    const profile = wrapper.find('[class="profile"]');

    expect(profile.isVisible()).toBe(false);
  });

  it("if the authState and idToken are set, display the name of the user in the profile", () => {
    const name = "John Doe";
    const authState = {
      idToken: {
        claims: {
          name,
        },
      },
    };
    const wrapper = shallowMount(Profile, {
      props: { authState },
    });

    expect(wrapper.html()).toContain(`<strong>${name}</strong>`);
  });
});
