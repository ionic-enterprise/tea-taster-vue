import { useTastingNotes } from '@/composables/tasting-notes';
import TastingNotesPage from '@/views/TastingNotesPage.vue';
import { IonTitle, alertController, modalController } from '@ionic/vue';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { DOMWrapper, flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { vi } from 'vitest';
import { Router } from 'vue-router';

vi.mock('@/composables/vault-factory');
vi.mock('@/composables/tasting-notes');

describe('TastingNotesPage.vue', () => {
  let router: Router;

  const mountView = async (): Promise<VueWrapper<any>> => {
    router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [{ path: '/', component: TastingNotesPage }],
    });
    router.push('/');
    await router.isReady();
    return mount(TastingNotesPage, {
      global: {
        plugins: [router],
      },
    });
  };

  beforeEach(() => {
    const { notes } = useTastingNotes();
    notes.value = [
      {
        id: 42,
        brand: 'Lipton',
        name: 'Green Tea',
        teaCategoryId: 3,
        rating: 3,
        notes: 'A basic green tea, very passable but nothing special',
      },
      {
        id: 314159,
        brand: 'Lipton',
        name: 'Yellow Label',
        teaCategoryId: 2,
        rating: 1,
        notes: 'Very acidic, even as dark teas go, OK for iced tea, horrible for any other application',
      },
      {
        id: 73,
        brand: 'Rishi',
        name: 'Puer Cake',
        teaCategoryId: 6,
        rating: 5,
        notes: 'Smooth and peaty, the king of puer teas',
      },
    ];
    vi.resetAllMocks();
  });

  it('displays the title', async () => {
    const wrapper = await mountView();
    const titles = wrapper.findAllComponents(IonTitle);
    expect(titles).toHaveLength(2);
    expect(titles[0].text()).toBe('Tasting Notes');
    expect(titles[1].text()).toBe('Tasting Notes');
  });

  it('refreshes the tasting notes data', async () => {
    const { refresh } = useTastingNotes();
    await mountView();
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it('displays the notes', async () => {
    const wrapper = await mountView();
    const list = wrapper.find('[data-testid="notes-list"]');
    const items = list.findAll('ion-item');
    expect(items.length).toBe(3);
    expect(items[0].text()).toContain('Lipton');
    expect(items[0].text()).toContain('Green Tea');
    expect(items[1].text()).toContain('Lipton');
    expect(items[1].text()).toContain('Yellow Label');
    expect(items[2].text()).toContain('Rishi');
    expect(items[2].text()).toContain('Puer Cake');
  });

  describe('adding a new note', () => {
    let modal: { present: () => Promise<void> };
    beforeEach(() => {
      modal = {
        present: vi.fn().mockResolvedValue(undefined),
      };
      modalController.create = vi.fn().mockResolvedValue(modal);
    });

    it('displays the modal', async () => {
      const wrapper = await mountView();
      const button = wrapper.findComponent('[data-testid="add-note-button"]');
      await button.trigger('click');
      expect(modal.present).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleting a note', () => {
    let alert: { present: () => Promise<void>; onDidDismiss: () => Promise<{ role: string }> };
    let button: DOMWrapper<Element>;
    beforeEach(async () => {
      alert = {
        present: vi.fn().mockResolvedValue(undefined),
        onDidDismiss: vi.fn().mockResolvedValue({ role: 'unknown' }),
      };
      alertController.create = vi.fn().mockResolvedValue(alert);
      const wrapper = await mountView();
      const buttons = wrapper.findAll('[data-testid="delete-button"]');
      button = buttons[1];
    });

    it('displays an alert', async () => {
      await button.trigger('click');
      await flushPromises();
      expect(alert.present).toHaveReturnedTimes(1);
    });

    describe('when the user answers yes', () => {
      beforeEach(() => {
        alert.onDidDismiss = vi.fn().mockResolvedValue({ role: 'yes' });
      });

      it('removes the note', async () => {
        const { remove } = useTastingNotes();
        await button.trigger('click');
        await flushPromises();
        expect(remove).toHaveBeenCalledTimes(1);
        expect(remove).toHaveBeenCalledWith({
          id: 314159,
          brand: 'Lipton',
          name: 'Yellow Label',
          teaCategoryId: 2,
          rating: 1,
          notes: 'Very acidic, even as dark teas go, OK for iced tea, horrible for any other application',
        });
      });
    });

    describe('when the user answers no', () => {
      beforeEach(() => {
        alert.onDidDismiss = vi.fn().mockResolvedValue({ role: 'no' });
      });

      it('does not remove the note', async () => {
        const { remove } = useTastingNotes();
        await button.trigger('click');
        await flushPromises();
        expect(remove).not.toHaveBeenCalled();
      });
    });
  });
});
