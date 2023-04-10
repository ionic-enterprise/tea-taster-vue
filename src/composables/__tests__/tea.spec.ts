import { useBackendAPI } from '@/composables/backend-api';
import { useTea } from '@/composables/tea';
import { Tea } from '@/models';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

vi.mock('@/composables/backend-api');

describe('useTea', () => {
  const { client } = useBackendAPI();
  let expectedTeas: Array<Tea>;
  let httpResultTeas: Array<Omit<Tea, 'image'>>;

  beforeEach(() => {
    initializeTestData();
    vi.resetAllMocks();
    (client.get as Mock).mockResolvedValue({});
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
      vi.resetAllMocks();
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
      });
      expect(client.get).not.toHaveBeenCalled();
    });

    it('returns undefined if the tea does not exist', async () => {
      expect(await find(42)).toBeUndefined();
    });
  });

  const initializeTestData = () => {
    expectedTeas = [
      {
        id: 1,
        name: 'Green',
        image: 'img/green.jpg',
        description: 'Green tea description.',
      },
      {
        id: 2,
        name: 'Black',
        image: 'img/black.jpg',
        description: 'Black tea description.',
      },
      {
        id: 3,
        name: 'Herbal',
        image: 'img/herbal.jpg',
        description: 'Herbal Infusion description.',
      },
      {
        id: 4,
        name: 'Oolong',
        image: 'img/oolong.jpg',
        description: 'Oolong tea description.',
      },
      {
        id: 5,
        name: 'Dark',
        image: 'img/dark.jpg',
        description: 'Dark tea description.',
      },
      {
        id: 6,
        name: 'Puer',
        image: 'img/puer.jpg',
        description: 'Puer tea description.',
      },
      {
        id: 7,
        name: 'White',
        image: 'img/white.jpg',
        description: 'White tea description.',
      },
      {
        id: 8,
        name: 'Yellow',
        image: 'img/yellow.jpg',
        description: 'Yellow tea description.',
      },
    ];
    httpResultTeas = expectedTeas.map((t: Tea) => {
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const { image, ...tea } = { ...t };
      return tea;
    });
  };
});
