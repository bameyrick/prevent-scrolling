import { Enum } from 'enum-keys-values-entries';
import { MOUSE_SCROLL_EVENTS, PreventScrolling, ReEnableScrolling } from '../src';
import { Key } from '../src/keycodes';

describe(`prevent scrolling`, () => {
  const bodyWidth = 10000;
  const bodyHeight = 10000;

  beforeEach(() => {
    const body = document.body;

    body.style.width = `${bodyWidth}px`;
    body.style.height = `${bodyHeight}px`;

    window.scrollTo(bodyWidth / 2, bodyHeight / 2);
  });

  it(`Should have set the testbed up for scrolling`, () => {
    expect(window.outerHeight > window.innerHeight).toBeTrue();
    expect(window.scrollX).toEqual(bodyWidth / 2);
    expect(window.scrollY).toEqual(bodyHeight / 2);
  });

  describe(`When scrolling prevented`, () => {
    beforeEach(() => PreventScrolling());

    afterEach(() => ReEnableScrolling());

    MOUSE_SCROLL_EVENTS.forEach(mouseEvent => {
      it(`Should prevent default on a ${mouseEvent} event`, () => {
        const event = new MouseEvent(mouseEvent, { screenY: 10, clientY: 10 });

        spyOn(event, 'preventDefault');

        window.dispatchEvent(event);

        expect(event.preventDefault).toHaveBeenCalled();
      });
    });

    Enum.entries(Key).forEach(([name, key]: [string, string]) => {
      it(`Should prevent default on a keydown event with key ${name}`, () => {
        const event = new KeyboardEvent('keydown', { key });

        spyOn(event, 'preventDefault');

        window.dispatchEvent(event);

        expect(event.preventDefault).toHaveBeenCalled();
      });
    });

    it(`Should not prevent default on a keyboard event that does not trigger scrolling`, () => {
      const event = new KeyboardEvent('keydown', { key: 'a' });

      spyOn(event, 'preventDefault');

      window.dispatchEvent(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it(`Should prevent window scrolling`, () => {
      const previousScrollX = window.pageXOffset;
      const previousScrollY = window.pageYOffset;

      const event = new MouseEvent('scroll', { screenY: 10, clientY: 10 });
      window.scrollTo(10, 10);
      window.dispatchEvent(event);

      expect(window.pageXOffset).toEqual(previousScrollX);
      expect(window.pageYOffset).toEqual(previousScrollY);
    });
  });

  describe(`When scrolling re enabled`, () => {
    beforeEach(() => {
      PreventScrolling();
      ReEnableScrolling();
    });

    MOUSE_SCROLL_EVENTS.forEach(mouseEvent => {
      it(`Shouldn't prevent on a ${mouseEvent} event`, () => {
        const event = new MouseEvent(mouseEvent, { screenY: 10, clientY: 10 });

        spyOn(event, 'preventDefault');

        window.dispatchEvent(event);

        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });

    Enum.entries(Key).forEach(([name, key]: [string, string]) => {
      it(`Should'nt prevent default on a keydown event with key ${name}`, () => {
        const event = new KeyboardEvent('keydown', { key });

        spyOn(event, 'preventDefault');

        window.dispatchEvent(event);

        expect(event.preventDefault).not.toHaveBeenCalled();
      });
    });

    it(`Should allow window scrolling`, () => {
      const previousScrollX = window.pageXOffset;
      const previousScrollY = window.pageYOffset;

      const event = new MouseEvent('scroll', { screenY: 10, clientY: 10 });
      window.scrollTo(10, 10);
      window.dispatchEvent(event);

      expect(window.pageXOffset).not.toEqual(previousScrollX);
      expect(window.pageYOffset).not.toEqual(previousScrollY);
    });
  });
});
