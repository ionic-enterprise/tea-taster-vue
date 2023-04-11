import { TastingNote } from '@/models';
import { ref } from 'vue';
import { useBackendAPI } from './backend-api';

const { client } = useBackendAPI();

const notes = ref<Array<TastingNote>>([]);

const find = async (id: number): Promise<TastingNote | undefined> => {
  if (!notes.value.length) {
    await refresh();
  }
  return notes.value.find((x) => x.id === id);
};

const merge = (note: TastingNote): Promise<TastingNote> => {
  return note.id ? updateNote(note) : addNote(note);
};

const addNote = async (note: TastingNote): Promise<TastingNote> => {
  const { data } = await client.post('/user-tasting-notes', note);
  notes.value.push(data);
  return data;
};

const updateNote = async (note: TastingNote): Promise<TastingNote> => {
  const { data } = await client.post(`/user-tasting-notes/${note.id}`, note);
  const idx = notes.value.findIndex((x) => x.id === note.id);
  if (idx > -1) {
    notes.value[idx] = data;
  }
  return data;
};

const refresh = async (): Promise<void> => {
  notes.value = await client.get('/user-tasting-notes').then((res) => res.data || []);
};

const remove = async (note: TastingNote): Promise<void> => {
  await client.delete(`/user-tasting-notes/${note.id}`);
  notes.value = notes.value.filter((x) => x.id !== note.id);
};

export const useTastingNotes = () => ({
  notes,
  find,
  merge,
  refresh,
  remove,
});
