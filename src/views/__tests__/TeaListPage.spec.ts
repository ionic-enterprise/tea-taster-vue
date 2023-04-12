import { useTea } from '@/composables/tea';
import TeaListPage from '@/views/TeaListPage.vue';
import { IonCard, IonTitle } from '@ionic/vue';
import { mount, VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Router, createRouter, createWebHistory } from 'vue-router';

vi.mock('@/composables/tea');

describe('tea list page', () => {
  const { teas } = useTea();
  let router: Router;

  const mountView = async (): Promise<VueWrapper<any>> => {
    router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [{ path: '/', component: TeaListPage }],
    });
    router.push('/');
    await router.isReady();
    return mount(TeaListPage, {
      global: {
        plugins: [router],
      },
    });
  };

  beforeEach(() => {
    teas.value = [
      {
        id: 1,
        name: 'Green',
        image: 'img/green.jpg',
        description:
          'Green teas have the oxidation process stopped very early on, leaving them with a very subtle flavor and ' +
          'complex undertones. These teas should be steeped at lower temperatures for shorter periods of time.',
        rating: 0,
      },
      {
        id: 2,
        name: 'Black',
        image: 'img/black.jpg',
        description:
          'A fully oxidized tea, black teas have a dark color and a full robust and pronounced flavor. Black teas tend ' +
          'to have a higher caffeine content than other teas.',
        rating: 0,
      },
      {
        id: 3,
        name: 'Herbal',
        image: 'img/herbal.jpg',
        description:
          'Herbal infusions are not actually "tea" but are more accurately characterized as infused beverages ' +
          'consisting of various dried herbs, spices, and fruits.',
        rating: 4,
      },
      {
        id: 4,
        name: 'Oolong',
        image: 'img/oolong.jpg',
        description:
          'Oolong teas are partially oxidized, giving them a flavor that is not as robust as black teas but also ' +
          'not as subtle as green teas. Oolong teas often have a flowery fragrance.',
        rating: 3,
      },
      {
        id: 5,
        name: 'Dark',
        image: 'img/dark.jpg',
        description:
          'From the Hunan and Sichuan provinces of China, dark teas are flavorful aged probiotic teas that steeps ' +
          'up very smooth with slightly sweet notes.',
        rating: 0,
      },
      {
        id: 6,
        name: 'Puer',
        image: 'img/puer.jpg',
        description:
          'An aged black tea from china. Puer teas have a strong rich flavor that could be described as "woody" or "peaty."',
        rating: 5,
      },
      {
        id: 7,
        name: 'White',
        image: 'img/white.jpg',
        description:
          'White tea is produced using very young shoots with no oxidation process. White tea has an extremely ' +
          'delicate flavor that is sweet and fragrant. White tea should be steeped at lower temperatures for ' +
          'short periods of time.',
        rating: 0,
      },
    ];
    vi.resetAllMocks();
  });

  it('displays the title', async () => {
    const wrapper = await mountView();
    const titles = wrapper.findAllComponents(IonTitle);
    expect(titles).toHaveLength(2);
    expect(titles[0].text()).toBe('Teas');
    expect(titles[1].text()).toBe('Teas');
  });

  it('refreshes the tea data', async () => {
    const { refresh } = useTea();
    await mountView();
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  describe('with seven teas', () => {
    it('displays two rows', async () => {
      const wrapper = await mountView();
      const rows = wrapper.findAll('ion-grid ion-row');
      expect(rows).toHaveLength(2);
    });

    it('displays four columns in the first row', async () => {
      const wrapper = await mountView();
      const rows = wrapper.findAll('ion-grid ion-row');
      const cols = rows[0].findAll('ion-col');
      expect(cols).toHaveLength(4);
    });

    it('displays three columns in the second row', async () => {
      const wrapper = await mountView();
      const rows = wrapper.findAll('ion-grid ion-row');
      const cols = rows[1].findAll('ion-col');
      expect(cols).toHaveLength(3);
    });

    it('displays the name in the title', async () => {
      const wrapper = await mountView();
      const cols = wrapper.findAll('ion-col');
      cols.forEach((c, idx) => {
        const title = c.find('ion-card ion-card-header ion-card-title');
        expect(title.text()).toBe(teas.value[idx].name);
      });
    });

    it('displays the description in the content', async () => {
      const wrapper = await mountView();
      const cols = wrapper.findAll('ion-col');
      cols.forEach((c, idx) => {
        const title = c.find('ion-card ion-card-content');
        expect(title.text()).toBe(teas.value[idx].description);
      });
    });

    it('navigates to the tea details page when a tea card is clicked', async () => {
      const wrapper = await mountView();
      const cards = wrapper.findAllComponents(IonCard);
      router.push = vi.fn();
      cards[3].trigger('click');
      expect(router.push).toHaveBeenCalledTimes(1);
      expect(router.push).toHaveBeenCalledWith('/tabs/teas/tea/4');
    });
  });
});
