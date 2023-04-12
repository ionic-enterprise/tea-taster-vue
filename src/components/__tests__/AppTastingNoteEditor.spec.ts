import AppTastingNoteEditor from '@/components/AppTastingNoteEditor.vue';
import { useTea } from '@/composables/tea';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import waitForExpect from 'wait-for-expect';
import { useTastingNotes } from '@/composables/tasting-notes';
import { Share } from '@capacitor/share';
import { IonTitle, isPlatform, modalController } from '@ionic/vue';

vi.mock('@capacitor/share');
vi.mock('@/composables/tasting-notes');
vi.mock('@/composables/tea');

vi.mock('@ionic/vue', async () => {
  const actual = (await vi.importActual('@ionic/vue')) as any;
  return { ...actual, isPlatform: vi.fn() };
});

describe('AppTastingNoteEditor.vue', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    const { teas } = useTea();
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
        rating: 0,
      },
    ];
    vi.resetAllMocks();
    (isPlatform as Mock).mockImplementation((key: string) => key === 'hybrid');
    wrapper = mount(AppTastingNoteEditor);
  });

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('binds the teas in the select', () => {
    const select = wrapper.find('[data-testid="tea-type-select"]');
    const opts = select.findAll('ion-select-option');
    expect(opts.length).toBe(3);
    expect(opts[0].text()).toBe('Green');
    expect(opts[1].text()).toBe('Black');
    expect(opts[2].text()).toBe('Herbal');
  });

  it('displays messages as the user enters invalid data', async () => {
    const brand = wrapper.findComponent('[data-testid="brand-input"]');
    const name = wrapper.findComponent('[data-testid="name-input"]');
    const notes = wrapper.findComponent('[data-testid="notes-textbox"]');
    const msg = wrapper.find('[data-testid="message-area"]');

    await flushPromises();
    await waitForExpect(() => expect(msg.text()).toBe(''));

    await brand.setValue('foobar');
    await flushPromises();
    await waitForExpect(() => expect(msg.text()).toBe(''));

    await brand.setValue('');
    await flushPromises();
    await waitForExpect(() => expect(msg.text()).toBe('Brand is a required field'));

    await brand.setValue('Lipton');
    await flushPromises();
    await waitForExpect(() => expect(msg.text()).toBe(''));

    await name.setValue('foobar');
    await flushPromises();
    await waitForExpect(() => expect(msg.text()).toBe(''));

    await name.setValue('');
    await flushPromises();
    await waitForExpect(() => expect(msg.text()).toBe('Name is a required field'));

    await name.setValue('Yellow Label');
    await flushPromises();
    await waitForExpect(() => expect(msg.text()).toBe(''));

    await notes.setValue('foobar');
    await flushPromises();
    await waitForExpect(() => expect(msg.text()).toBe(''));

    await notes.setValue('');
    await flushPromises();
    await waitForExpect(() => expect(msg.text()).toBe('Notes is a required field'));

    await notes.setValue('Not very good');
    await flushPromises();
    await waitForExpect(() => expect(msg.text()).toBe(''));
  });

  it('displays an appropriate title', async () => {
    const title = wrapper.findComponent(IonTitle);
    expect(title.text()).toBe('Add Note');
    await wrapper.setProps({ noteId: 42 });
    expect(title.text()).toBe('Update Note');
  });

  it('populates the data when editing a note', async () => {
    const { find } = useTastingNotes();
    (find as Mock).mockResolvedValue({
      id: 73,
      brand: 'Rishi',
      name: 'Puer Cake',
      teaCategoryId: 6,
      rating: 5,
      notes: 'Smooth and peaty, the king of puer teas',
    });
    const modal = mount(AppTastingNoteEditor, {
      props: {
        noteId: 73,
      },
    });
    await flushPromises();
    expect(find).toHaveBeenCalledTimes(1);
    expect(find).toHaveBeenCalledWith(73);
    const brand = modal.findComponent('[data-testid="brand-input"]');
    const name = modal.findComponent('[data-testid="name-input"]');
    const rating = modal.findComponent('[data-testid="rating-input"]');
    const notes = modal.findComponent('[data-testid="notes-textbox"]');
    const teaCategory = modal.findComponent('[data-testid="tea-type-select"]');
    expect((brand.element as HTMLInputElement).value).toEqual('Rishi');
    expect((name.element as HTMLInputElement).value).toEqual('Puer Cake');
    expect((teaCategory.element as HTMLSelectElement).value).toEqual(6);
    expect((notes.element as HTMLInputElement).value).toEqual('Smooth and peaty, the king of puer teas');
    expect((rating as VueWrapper).props().modelValue).toEqual(5);
  });

  describe('submit button', () => {
    it('displays appropriate text', async () => {
      const button = wrapper.findComponent('[data-testid="submit-button"]');
      expect(button.text()).toBe('Add');
      await wrapper.setProps({ noteId: 42 });
      expect(button.text()).toBe('Update');
    });

    it('is disabled until valid data is entered', async () => {
      const brand = wrapper.findComponent('[data-testid="brand-input"]');
      const name = wrapper.findComponent('[data-testid="name-input"]');
      const teaType = wrapper.findComponent('[data-testid="tea-type-select"]');
      const rating = wrapper.findComponent('[data-testid="rating-input"]');
      const notes = wrapper.findComponent('[data-testid="notes-textbox"]');

      const button = wrapper.find('[data-testid="submit-button"]');

      await flushPromises();
      await waitForExpect(() => expect((button.element as HTMLIonButtonElement).disabled).toBe(true));

      await brand.setValue('foobar');
      await flushPromises();
      await waitForExpect(() => expect((button.element as HTMLIonButtonElement).disabled).toBe(true));

      await name.setValue('mytea');
      await flushPromises();
      await waitForExpect(() => expect((button.element as HTMLIonButtonElement).disabled).toBe(true));

      await teaType.setValue(3);
      await flushPromises();
      await waitForExpect(() => expect((button.element as HTMLIonButtonElement).disabled).toBe(true));

      await rating.setValue(2);
      await flushPromises();
      await waitForExpect(() => expect((button.element as HTMLIonButtonElement).disabled).toBe(true));

      await notes.setValue('Meh. It is ok.');
      await flushPromises();
      await waitForExpect(() => expect((button.element as HTMLIonButtonElement).disabled).toBe(false));
    });

    describe('on click', () => {
      beforeEach(async () => {
        const brand = wrapper.findComponent('[data-testid="brand-input"]');
        const name = wrapper.findComponent('[data-testid="name-input"]');
        const teaType = wrapper.findComponent('[data-testid="tea-type-select"]');
        const rating = wrapper.findComponent('[data-testid="rating-input"]');
        const notes = wrapper.findComponent('[data-testid="notes-textbox"]');

        await brand.setValue('foobar');
        await name.setValue('mytea');
        await teaType.setValue(3);
        await rating.setValue(2);
        await notes.setValue('Meh. It is ok.');

        modalController.dismiss = vi.fn();
      });

      it('merges the tasting note', async () => {
        const { merge } = useTastingNotes();
        const button = wrapper.find('[data-testid="submit-button"]');
        await button.trigger('click');

        expect(merge).toHaveBeenCalledTimes(1);
        expect(merge).toHaveBeenCalledWith({
          brand: 'foobar',
          name: 'mytea',
          rating: 2,
          teaCategoryId: 3,
          notes: 'Meh. It is ok.',
        });
      });

      it('includes the ID if it set', async () => {
        const { merge } = useTastingNotes();
        const button = wrapper.find('[data-testid="submit-button"]');
        await wrapper.setProps({ noteId: 4273 });
        await button.trigger('click');

        expect(merge).toHaveBeenCalledWith({
          id: 4273,
          brand: 'foobar',
          name: 'mytea',
          rating: 2,
          teaCategoryId: 3,
          notes: 'Meh. It is ok.',
        });
      });

      it('closes the modal', async () => {
        const button = wrapper.find('[data-testid="submit-button"]');

        expect(modalController.dismiss).not.toHaveBeenCalled();
        await button.trigger('click');
        expect(modalController.dismiss).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('cancel button', () => {
    beforeEach(() => {
      modalController.dismiss = vi.fn();
    });

    it('does not merge', async () => {
      const { merge } = useTastingNotes();
      const button = wrapper.find('[data-testid="cancel-button"]');
      await button.trigger('click');
      expect(merge).not.toHaveBeenCalled();
    });

    it('closes the modal', async () => {
      const button = wrapper.find('[data-testid="cancel-button"]');

      expect(modalController.dismiss).not.toHaveBeenCalled();
      await button.trigger('click');
      expect(modalController.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('share button', () => {
    describe('in a web context', () => {
      beforeEach(() => {
        (isPlatform as Mock).mockImplementation((key: string) => key !== 'hybrid');
      });

      afterEach(() => {
        (isPlatform as Mock).mockImplementation((key: string) => key === 'hybrid');
      });

      it('does not exist', () => {
        const modal = mount(AppTastingNoteEditor);
        const button = modal.findComponent('[data-testid="share-button"]');
        expect(button.exists()).toBe(false);
      });
    });

    describe('in a mobile context', () => {
      it('exists', () => {
        const button = wrapper.findComponent('[data-testid="share-button"]');
        expect(button.exists()).toBe(true);
      });

      it('is disabled until enough information is entered', async () => {
        const button = wrapper.findComponent('[data-testid="share-button"]');
        const brand = wrapper.findComponent('[data-testid="brand-input"]');
        const name = wrapper.findComponent('[data-testid="name-input"]');
        const rating = wrapper.findComponent('[data-testid="rating-input"]');

        await flushPromises();
        await waitForExpect(() => expect((button.element as HTMLIonButtonElement).disabled).toBe(true));

        await brand.setValue('foobar');
        await flushPromises();
        await waitForExpect(() => expect((button.element as HTMLIonButtonElement).disabled).toBe(true));

        await name.setValue('mytea');
        await flushPromises();
        await waitForExpect(() => expect((button.element as HTMLIonButtonElement).disabled).toBe(true));

        await rating.setValue(2);
        await flushPromises();
        await waitForExpect(() => expect((button.element as HTMLIonButtonElement).disabled).toBe(false));
      });

      it('calls the share plugin when pressed', async () => {
        const button = wrapper.find('[data-testid="share-button"]');
        const brand = wrapper.findComponent('[data-testid="brand-input"]');
        const name = wrapper.findComponent('[data-testid="name-input"]');
        const rating = wrapper.findComponent('[data-testid="rating-input"]');

        await brand.setValue('foobar');
        await name.setValue('mytea');
        await rating.setValue(2);

        await button.trigger('click');

        expect(Share.share).toHaveBeenCalledTimes(1);
        expect(Share.share).toHaveBeenCalledWith({
          title: 'foobar: mytea',
          text: 'I gave foobar: mytea 2 stars on the Tea Taster app',
          dialogTitle: 'Share your tasting note',
          url: 'https://tea-taster-training.web.app',
        });
      });
    });
  });
});
