import { Enum } from 'enum-keys-values-entries';
import { MOUSE_SCROLL_EVENTS, PreventScrolling, ReEnableScrolling } from '../src';
import { Key } from '../src/keycodes';

describe(`prevent scrolling`, () => {
  const bodyWidth = 10000;
  const bodyHeight = 10000;

  const input = document.createElement('input');
  const textarea = document.createElement('textarea');
  const scrollableElement = document.createElement('div');

  beforeAll(() => {
    document.body.append(input);
    document.body.append(textarea);

    scrollableElement.style.width = '100px';
    scrollableElement.style.height = '100px';
    scrollableElement.style.overflow = 'auto';

    const innerElement = document.createElement('div');
    innerElement.style.width = '200px';
    innerElement.style.height = '200px';

    scrollableElement.append(innerElement);

    document.body.append(scrollableElement);

    window.dispatchEvent(new Event('click'));
  });

  beforeEach(() => {
    const body = document.body;

    body.style.width = `${bodyWidth}px`;
    body.style.height = `${bodyHeight}px`;

    window.scrollTo(bodyWidth / 2, bodyHeight / 2);
  });

  it(`Should have set the testbed up for scrolling`, () => {
    expect(window.scrollX).toEqual(bodyWidth / 2);
    expect(window.scrollY).toEqual(bodyHeight / 2);
  });

  describe(`When scrolling prevented`, () => {
    beforeEach(() => PreventScrolling(scrollableElement));

    afterEach(() => ReEnableScrolling());

    it(`Should do nothing if scrolling has already been prevented`, () => {
      spyOn(window, 'addEventListener');

      PreventScrolling();

      expect(window.addEventListener).not.toHaveBeenCalled();
    });

    MOUSE_SCROLL_EVENTS.forEach(mouseEvent => {
      it(`Should prevent default on a ${mouseEvent} event`, () => {
        const event = new MouseEvent(mouseEvent, { screenY: 10, clientY: 10, bubbles: true });

        spyOn(event, 'preventDefault');

        input.dispatchEvent(event);
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

    it(`Shouldn't prevent default on a keyboard event triggered from an input`, () => {
      const event = new KeyboardEvent('keydown', { key: Key.Down });

      spyOn(event, 'preventDefault');

      input.dispatchEvent(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it(`Shouldn't prevent default on a keyboard event triggered from an textarea`, () => {
      const event = new KeyboardEvent('keydown', { key: Key.Down });

      spyOn(event, 'preventDefault');

      textarea.dispatchEvent(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it(`Shouldn't prevent default if a allow scrolling element has been clicked`, () => {
      const event = new KeyboardEvent('keydown', { key: Key.Down });

      spyOn(event, 'preventDefault');

      scrollableElement.dispatchEvent(new Event('click'));

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
      PreventScrolling([scrollableElement]);
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
      it(`Shouldn't prevent default on a keydown event with key ${name}`, () => {
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
