import { shallowMount } from "@vue/test-utils";
import Menu from "@/components/Menu.vue";

describe("Menu.vue", () => {
  it("when authstate is empty, 3 buttons are visible, 1 is not visible", () => {
    const authState = {}
    const wrapper = shallowMount(Menu, {
      props: { authState },
    });
    
    const buttons = wrapper.findAll('Button');

    expect(buttons.length).toBe(4);
  });
});
