import { ref } from 'vue';
import { Tea } from '@/models';
import { useBackendAPI } from './backend-api';

const { client } = useBackendAPI();
const teas = ref<Array<Tea>>([]);
const images: Array<string> = ['green', 'black', 'herbal', 'oolong', 'dark', 'puer', 'white', 'yellow'];

const refresh = async (): Promise<void> => {
  teas.value = await client.get('/tea-categories').then((res) => unpack(res.data || []));
};

const unpack = (data: Array<Omit<Tea, 'image'>>): Array<Tea> => {
  return data.map((t) => ({ ...t, image: `img/${images[t.id - 1]}.jpg` }));
};

export const useTea = () => ({
  refresh,
  teas,
});
