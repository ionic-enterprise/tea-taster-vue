import AppPinDialog from '@/components/AppPinDialog.vue';
import { modalController } from '@ionic/vue';
import { mount, VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('AppPinDialog', () => {
  const createComponent = (setPasscodeMode = false): VueWrapper<any> => {
    return mount(AppPinDialog as any, { props: { setPasscodeMode } });
  };

  it('renders', () => {
    const wrapper = createComponent();
    expect(wrapper.exists()).toBe(true);
  });

  describe('entering a new PIN', () => {
    let wrapper: VueWrapper<any>;
    beforeEach(() => {
      wrapper = createComponent(true);
    });

    it('sets the title to "Create PIN"', () => {
      const title = wrapper.find('ion-title');
      expect(title.text()).toEqual('Create PIN');
    });

    it('sets the prompt to "Create Session PIN"', () => {
      const prompt = wrapper.find('[data-testid="prompt"]');
      expect(prompt.text()).toEqual('Create Session PIN');
    });

    it('adds markers for each button press, stopping after nine', async () => {
      const pin = wrapper.find('[data-testid="display-pin"]');
      const buttons = wrapper.findAll('[data-testclass="number-button"]');
      await buttons[0].trigger('click');
      expect(pin.text()).toEqual('*');
      await buttons[3].trigger('click');
      expect(pin.text()).toEqual('**');
      await buttons[1].trigger('click');
      expect(pin.text()).toEqual('***');
      await buttons[8].trigger('click');
      expect(pin.text()).toEqual('****');
      for (let x = 0; x < 4; x++) {
        await buttons[6].trigger('click');
      }
      expect(pin.text()).toEqual('********');
      await buttons[9].trigger('click');
      expect(pin.text()).toEqual('*********');
      for (let x = 0; x < 4; x++) {
        await buttons[3].trigger('click');
        expect(pin.text()).toEqual('*********');
      }
    });

    describe('pressing delete', () => {
      it('removes a marker', async () => {
        const pin = wrapper.find('[data-testid="display-pin"]');
        const deleteButton = wrapper.find('[data-testid="delete-button"]');
        const buttons = wrapper.findAll('[data-testclass="number-button"]');
        for (let x = 0; x < 4; x++) {
          await buttons[6].trigger('click');
        }
        expect(pin.text()).toEqual('****');
        await deleteButton.trigger('click');
        expect(pin.text()).toEqual('***');
      });
    });

    describe('cancel button', () => {
      it('does not exist', async () => {
        modalController.dismiss = vi.fn();
        const cancel = wrapper.find('[data-testid="cancel-button"]');
        expect(cancel.exists()).toBe(false);
      });
    });

    describe('pressing enter', () => {
      it('asks for re-entry', async () => {
        const pin = wrapper.find('[data-testid="display-pin"]');
        const enterButton = wrapper.find('[data-testid="enter-button"]');
        const buttons = wrapper.findAll('[data-testclass="number-button"]');
        const prompt = wrapper.find('[data-testid="prompt"]');
        await buttons[0].trigger('click');
        await buttons[3].trigger('click');
        await buttons[1].trigger('click');
        await buttons[8].trigger('click');
        expect(pin.text()).toEqual('****');
        await enterButton.trigger('click');
        expect(pin.text()).toEqual('');
        expect(prompt.text()).toEqual('Verify PIN');
      });

      it('dismissing when entered PINs match', async () => {
        modalController.dismiss = vi.fn();
        const enterButton = wrapper.find('[data-testid="enter-button"]');
        const buttons = wrapper.findAll('[data-testclass="number-button"]');
        await buttons[0].trigger('click');
        await buttons[3].trigger('click');
        await buttons[1].trigger('click');
        await buttons[8].trigger('click');
        await enterButton.trigger('click');
        expect(modalController.dismiss).not.toHaveBeenCalled();
        await buttons[0].trigger('click');
        await buttons[3].trigger('click');
        await buttons[1].trigger('click');
        await buttons[8].trigger('click');
        await enterButton.trigger('click');
        expect(modalController.dismiss).toHaveBeenCalledTimes(1);
        expect(modalController.dismiss).toHaveBeenCalledWith('1429');
      });

      it('provides an error when the PINs do not match', async () => {
        modalController.dismiss = vi.fn();
        const enterButton = wrapper.find('[data-testid="enter-button"]');
        const buttons = wrapper.findAll('[data-testclass="number-button"]');
        const errorMsg = wrapper.find('[data-testid="error-message"]');
        const prompt = wrapper.find('[data-testid="prompt"]');
        await buttons[0].trigger('click');
        await buttons[3].trigger('click');
        await buttons[1].trigger('click');
        await buttons[8].trigger('click');
        await enterButton.trigger('click');
        await buttons[0].trigger('click');
        await buttons[3].trigger('click');
        await buttons[2].trigger('click');
        await buttons[8].trigger('click');
        await enterButton.trigger('click');
        expect(modalController.dismiss).not.toHaveBeenCalled();
        expect(errorMsg.text()).toBe('PINs do not match');
        expect(prompt.text()).toBe('Create Session PIN');
      });
    });
  });

  describe('entering a PIN to unlock the vault', () => {
    let wrapper: VueWrapper<any>;
    beforeEach(() => {
      wrapper = createComponent(false);
    });

    it('sets the title to "Unlock"', () => {
      const title = wrapper.find('ion-title');
      expect(title.text()).toEqual('Unlock');
    });

    it('sets the prompt to "Enter PIN to Unlock"', () => {
      const prompt = wrapper.find('[data-testid="prompt"]');
      expect(prompt.text()).toEqual('Enter PIN to Unlock');
    });

    it('adds markers for each button press, stopping after nine', async () => {
      const pin = wrapper.find('[data-testid="display-pin"]');
      const buttons = wrapper.findAll('[data-testclass="number-button"]');
      await buttons[0].trigger('click');
      expect(pin.text()).toEqual('*');
      await buttons[3].trigger('click');
      expect(pin.text()).toEqual('**');
      await buttons[1].trigger('click');
      expect(pin.text()).toEqual('***');
      await buttons[8].trigger('click');
      expect(pin.text()).toEqual('****');
      for (let x = 0; x < 4; x++) {
        await buttons[6].trigger('click');
      }
      expect(pin.text()).toEqual('********');
      await buttons[9].trigger('click');
      expect(pin.text()).toEqual('*********');
      for (let x = 0; x < 4; x++) {
        await buttons[3].trigger('click');
        expect(pin.text()).toEqual('*********');
      }
    });

    describe('pressing delete', () => {
      it('removes a marker', async () => {
        const pin = wrapper.find('[data-testid="display-pin"]');
        const deleteButton = wrapper.find('[data-testid="delete-button"]');
        const buttons = wrapper.findAll('[data-testclass="number-button"]');
        for (let x = 0; x < 4; x++) {
          await buttons[6].trigger('click');
        }
        expect(pin.text()).toEqual('****');
        await deleteButton.trigger('click');
        expect(pin.text()).toEqual('***');
      });
    });

    describe('presssing the cancel button', () => {
      it('closes the modal', async () => {
        modalController.dismiss = vi.fn();
        const cancel = wrapper.find('[data-testid="cancel-button"]');
        await cancel.trigger('click');
        expect(modalController.dismiss).toHaveBeenCalledTimes(1);
        expect(modalController.dismiss).toHaveBeenCalledWith(undefined, 'cancel');
      });

      it('ignores entered data', async () => {
        modalController.dismiss = vi.fn();
        const cancel = wrapper.find('[data-testid="cancel-button"]');
        const buttons = wrapper.findAll('[data-testclass="number-button"]');
        await buttons[0].trigger('click');
        await buttons[3].trigger('click');
        await buttons[1].trigger('click');
        await buttons[8].trigger('click');
        await cancel.trigger('click');
        expect(modalController.dismiss).toHaveBeenCalledTimes(1);
        expect(modalController.dismiss).toHaveBeenCalledWith(undefined, 'cancel');
      });
    });

    describe('pressing enter', () => {
      it('closes the modal passing back the pin', async () => {
        modalController.dismiss = vi.fn();
        const pin = wrapper.find('[data-testid="display-pin"]');
        const enterButton = wrapper.find('[data-testid="enter-button"]');
        const buttons = wrapper.findAll('[data-testclass="number-button"]');
        await buttons[0].trigger('click');
        await buttons[3].trigger('click');
        await buttons[1].trigger('click');
        await buttons[8].trigger('click');
        expect(pin.text()).toEqual('****');
        await enterButton.trigger('click');
        expect(modalController.dismiss).toHaveBeenCalledTimes(1);
        expect(modalController.dismiss).toHaveBeenCalledWith('1429');
      });
    });
  });
});
