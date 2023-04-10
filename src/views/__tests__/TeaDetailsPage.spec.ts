import { useAuth } from '@/composables/auth';
import TeaDetailsPage from '@/views/TeaDetailsPage.vue';
import { IonContent, IonHeader, IonIcon } from '@ionic/vue';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { mount, VueWrapper, flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { Router } from 'vue-router';
import { useTea } from '@/composables/tea';

vi.mock('@/composables/tea');

describe('TeaDetailsPage.vue', () => {
  let router: Router;

  const mountView = async (): Promise<VueWrapper<any>> => {
    router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [{ path: '/teas/tea/:id', component: TeaDetailsPage }],
    });
    router.push('/teas/tea/3');
    await router.isReady();
    return mount(TeaDetailsPage, {
      global: {
        plugins: [router],
      },
    });
  };

  beforeEach(() => {
    const { find, teas } = useTea();
    teas.value = [
      {
        id: 1,
        name: 'Green',
        image: 'img/green.jpg',
        description: 'Green tea description.',
        rating: 3,
      },
      {
        id: 2,
        name: 'Black',
        image: 'img/black.jpg',
        description: 'Black tea description.',
        rating: 0,
      },
      {
        id: 3,
        name: 'Herbal',
        image: 'img/herbal.jpg',
        description: 'Herbal Infusion description.',
        rating: 5,
      },
      {
        id: 4,
        name: 'Oolong',
        image: 'img/oolong.jpg',
        description: 'Oolong tea description.',
        rating: 2,
      },
    ];
    vi.resetAllMocks();
    (find as Mock).mockResolvedValue(teas.value[2]);
  });

  it('renders', async () => {
    const wrapper = await mountView();
    const header = wrapper.findComponent(IonHeader);
    const content = wrapper.findComponent(IonContent);
    expect(header.exists()).toBe(true);
    expect(content.exists()).toBe(true);
  });

  it('finds the tea specified in the route', async () => {
    const { find } = useTea();
    await mountView();
    expect(find).toHaveBeenCalledTimes(1);
    expect(find).toHaveBeenCalledWith(3);
  });

  it('renders the tea name', async () => {
    const wrapper = await mountView();
    await flushPromises();
    const name = wrapper.find('[data-testid="name"]');
    expect(name.text()).toBe('Herbal');
  });

  it('renders the tea description', async () => {
    const wrapper = await mountView();
    await flushPromises();
    const description = wrapper.find('[data-testid="description"]');
    expect(description.text()).toBe('Herbal Infusion description.');
  });

  it('saves the rating on click', async () => {
    const wrapper = await mountView();
    await flushPromises();
    const { rate } = useTea();
    const rating = wrapper.findComponent('[data-testid="rating"]');
    const stars = rating.findAllComponents(IonIcon);
    stars[1].trigger('click');
    expect(rate).toHaveBeenCalledTimes(1);
    expect(rate).toHaveBeenCalledWith(3, 2);
  });
});
