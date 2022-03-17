import { shallowMount } from "@vue/test-utils";
import Header from "@/components/Header.vue";

describe("Header.vue", () => {
  it("don't show the header section if transaction status is set to CANCELLED", () => {
    const transaction = {
      status: "CANCELLED",
    };
    const wrapper = shallowMount(Header, {
      props: { transaction },
    });

    const header = wrapper.find('[class="header"]');

    expect(header.isVisible()).toBe(false);
  });

  it("display the header when authentication and meta are set", () => {
    const flow = "authenticate";
    const name = "identify";
    const transaction = {
      status: "PENDING",
      nextStep: {
        name,
      },
    };
    const meta = {
      flow,
    };
    const wrapper = shallowMount(Header, {
      props: { transaction, meta },
    });

    expect(wrapper.html()).toContain(`<h3>${flow} &gt; ${name}</h3>`);
  });
});
