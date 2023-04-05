import HomePage from '@/views/HomePage.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('HomePage.vue', () => {
  it('displays the title', () => {
    const wrapper = mount(HomePage);
    const titles = wrapper.findAll('ion-title');
    expect(titles).toHaveLength(2);
    expect(titles[0].text()).toBe('Blank');
    expect(titles[1].text()).toBe('Blank');
  });

  it('displays the default text', () => {
    const wrapper = mount(HomePage);
    const container = wrapper.find('#container');
    expect(container.text()).toContain('Ready to create an app?');
  });
});
