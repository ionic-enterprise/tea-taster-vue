import TeaListPage from '@/views/TeaListPage.vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

describe('tea list page', () => {
  it('displays the title', () => {
    const wrapper = mount(TeaListPage);
    const titles = wrapper.findAll('ion-title');
    expect(titles).toHaveLength(2);
    expect(titles[0].text()).toBe('Teas');
    expect(titles[1].text()).toBe('Teas');
  });

  describe('with seven teas', () => {
    it('displays two rows', () => {
      const wrapper = mount(TeaListPage);
      const rows = wrapper.findAll('ion-grid ion-row');
      expect(rows).toHaveLength(2);
    });

    it('displays four columns in the first row', () => {
      const wrapper = mount(TeaListPage);
      const rows = wrapper.findAll('ion-grid ion-row');
      const cols = rows[0].findAll('ion-col');
      expect(cols).toHaveLength(4);
    });

    it('displays three columns in the second row', () => {
      const wrapper = mount(TeaListPage);
      const rows = wrapper.findAll('ion-grid ion-row');
      const cols = rows[1].findAll('ion-col');
      expect(cols).toHaveLength(3);
    });

    it('displays the name in the title', () => {
      const wrapper = mount(TeaListPage);
      const teas = (wrapper.getCurrentComponent() as any).setupState.teaData;
      const cols = wrapper.findAll('ion-col');
      cols.forEach((c, idx) => {
        const title = c.find('ion-card ion-card-header ion-card-title');
        expect(title.text()).toBe(teas[idx].name);
      });
    });

    it('displays the description in the content', () => {
      const wrapper = mount(TeaListPage);
      const teas = (wrapper.getCurrentComponent() as any).setupState.teaData;
      const cols = wrapper.findAll('ion-col');
      cols.forEach((c, idx) => {
        const title = c.find('ion-card ion-card-content');
        expect(title.text()).toBe(teas[idx].description);
      });
    });
  });
});
