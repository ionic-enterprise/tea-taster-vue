import { Preferences } from '@capacitor/preferences';
import { ref } from 'vue';
import { Tea } from '@/models';
import { useBackendAPI } from './backend-api';

const { client } = useBackendAPI();
const teas = ref<Array<Tea>>([]);
const images: Array<string> = ['green', 'black', 'herbal', 'oolong', 'dark', 'puer', 'white', 'yellow'];

type RawData = Omit<Tea, 'image' | 'rating'>;

const find = async (id: number): Promise<Tea | undefined> => {
  if (!teas.value.length) {
    await refresh();
  }
  return teas.value.find((x) => x.id === id);
};

const rate = async (id: number, rating: number): Promise<void> => {
  await Preferences.set({ key: `rating${id}`, value: rating.toString() });
  const tea = await find(id);
  if (tea) {
    tea.rating = rating;
  }
};

const refresh = async (): Promise<void> => {
  teas.value = await client.get('/tea-categories').then((res) => unpack(res.data || []));
};

const unpack = (data: Array<RawData>): Promise<Array<Tea>> => {
  return Promise.all(data.map((t) => transform(t)));
};

const transform = async (data: RawData): Promise<Tea> => {
  const { value } = await Preferences.get({ key: `rating${data.id}` });
  return {
    ...data,
    rating: parseInt(value || '0', 10),
    image: `img/${images[data.id - 1]}.jpg`,
  };
};

export const useTea = () => ({
  find,
  rate,
  refresh,
  teas,
});
