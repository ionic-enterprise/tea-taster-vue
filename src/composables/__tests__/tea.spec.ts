import { useBackendAPI } from '@/composables/backend-api';
import { useTea } from '@/composables/tea';
import { Tea } from '@/models';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { GetOptions, Preferences } from '@capacitor/preferences';

vi.mock('@capacitor/preferences');
vi.mock('@/composables/backend-api');

describe('useTea', () => {
  const { client } = useBackendAPI();
  let expectedTeas: Array<Tea>;
  let httpResultTeas: Array<Omit<Tea, 'image' | 'rating'>>;

  beforeEach(() => {
    initializeTestData();
    vi.resetAllMocks();
    (client.get as Mock).mockResolvedValue({});
    (Preferences.get as Mock).mockImplementation(async (opt: GetOptions) => {
      let value = null;
      switch (opt.key) {
        case 'rating3':
          value = '4';
          break;
        case 'rating5':
          value = '2';
          break;
        case 'rating6':
          value = '5';
          break;
      }
      return { value };
    });
  });

  describe('refresh', () => {
    it('gets the tea categories', async () => {
      const { refresh } = useTea();
      await refresh();
      expect(client.get).toHaveBeenCalledTimes(1);
      expect(client.get).toHaveBeenCalledWith('/tea-categories');
    });

    it('transforms the tea data', async () => {
      const { refresh, teas } = useTea();
      (client.get as Mock).mockResolvedValue({ data: httpResultTeas });
      await refresh();
      expect(teas.value).toEqual(expectedTeas);
    });
  });

  describe('find', () => {
    const { client } = useBackendAPI();
    const { find, refresh, teas } = useTea();

    beforeEach(() => {
      vi.clearAllMocks();
      teas.value = [];
      (client.get as Mock).mockResolvedValue({ data: httpResultTeas });
    });

    it('refreshes the tea data if it has not been loaded yet', async () => {
      const t = await find(6);
      expect(teas.value.length).toEqual(8);
      expect(t).toEqual({
        id: 6,
        name: 'Puer',
        image: 'img/puer.jpg',
        description: 'Puer tea description.',
        rating: 5,
      });
      expect(client.get).toHaveBeenCalledTimes(1);
      expect(client.get).toHaveBeenCalledWith('/tea-categories');
    });

    it('finds the tea from the existing teas', async () => {
      await refresh();
      vi.clearAllMocks();
      const t = await find(4);
      expect(t).toEqual({
        id: 4,
        name: 'Oolong',
        image: 'img/oolong.jpg',
        description: 'Oolong tea description.',
        rating: 0,
      });
      expect(client.get).not.toHaveBeenCalled();
    });

    it('returns undefined if the tea does not exist', async () => {
      expect(await find(42)).toBeUndefined();
    });
  });

  describe('rate', () => {
    const { rate, refresh, teas } = useTea();
    beforeEach(() => {
      const { client } = useBackendAPI();
      (client.get as Mock).mockResolvedValue({ data: httpResultTeas });
    });

    it('saves the value', async () => {
      await rate(5, 4);
      expect(Preferences.set).toHaveBeenCalledTimes(1);
      expect(Preferences.set).toHaveBeenCalledWith({
        key: 'rating5',
        value: '4',
      });
    });

    it('updates the tea list', async () => {
      await refresh();
      await rate(5, 4);
      const tea = teas.value.find((x) => x.id === 5);
      expect(tea?.rating).toBe(4);
    });
  });

  const initializeTestData = () => {
    expectedTeas = [
      {
        id: 1,
        name: 'Green',
        image: 'img/green.jpg',
        description: 'Green tea description.',
        rating: 0,
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
        rating: 4,
      },
      {
        id: 4,
        name: 'Oolong',
        image: 'img/oolong.jpg',
        description: 'Oolong tea description.',
        rating: 0,
      },
      {
        id: 5,
        name: 'Dark',
        image: 'img/dark.jpg',
        description: 'Dark tea description.',
        rating: 2,
      },
      {
        id: 6,
        name: 'Puer',
        image: 'img/puer.jpg',
        description: 'Puer tea description.',
        rating: 5,
      },
      {
        id: 7,
        name: 'White',
        image: 'img/white.jpg',
        description: 'White tea description.',
        rating: 0,
      },
      {
        id: 8,
        name: 'Yellow',
        image: 'img/yellow.jpg',
        description: 'Yellow tea description.',
        rating: 0,
      },
    ];
    httpResultTeas = expectedTeas.map((t: Tea) => {
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const { image, rating, ...tea } = { ...t };
      return tea;
    });
  };
});
