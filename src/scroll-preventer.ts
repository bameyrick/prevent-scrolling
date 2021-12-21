import { UAParser } from 'ua-parser-js';
import { PreventOverScrolling, ReEnableOverScrolling } from 'prevent-overscrolling';

import { passiveSupported } from './passive-supported';
import { USER_MOUSE_SCROLL_EVENTS, USER_SCROLL_KEYBOARD_EVENTS } from './user-scroll-events';

export const IGNORE_PREVENT_WINDOW_SCROLL_BROWSERS = ['Mobile Safari', 'Safari', 'IE', 'Edge'];

export default class ScrollPreventer {
  private scrollingPrevented: boolean = false;
  private scrollableAreaHasFocus: boolean = false;
  private previousScrollX: number;
  private previousScrollY: number;
  private allowScrollElements: HTMLElement[] = [];
  private browser: string = new UAParser().getBrowser().name || '';
  private mayPreventWindowScroll: boolean = !IGNORE_PREVENT_WINDOW_SCROLL_BROWSERS.includes(this.browser);

  constructor() {
    window.addEventListener('click', this.handleWindowClick.bind(this));
  }

  public PreventScrolling(allowScrollingOn?: HTMLElement | HTMLElement[]): void {
    if (this.scrollingPrevented) {
      return;
    }

    this.scrollingPrevented = true;

    if (allowScrollingOn) {
      this.allowScrollElements = Array.isArray(allowScrollingOn) ? allowScrollingOn : [allowScrollingOn];
    }

    this.lockWindow();
    this.setScrollingEvents(true);
  }

  public ReEnableScrolling(): void {
    if (this.scrollingPrevented) {
      this.unlockWindow();
      this.setScrollingEvents(false);
      this.scrollingPrevented = false;
    }
  }

  private lockWindow(): void {
    this.previousScrollX = window.pageXOffset;
    this.previousScrollY = window.pageYOffset;

    if (this.mayPreventWindowScroll) {
      window.addEventListener('scroll', this.setWindowScroll.bind(this));
    }
  }

  private unlockWindow(): void {
    window.removeEventListener('scroll', this.setWindowScroll.bind(this));
  }

  private setWindowScroll(): void {
    window.scrollTo(this.previousScrollX, this.previousScrollY);
  }

  private setScrollingEvents(enable: boolean): void {
    USER_MOUSE_SCROLL_EVENTS.forEach(event => {
      window[`${enable ? 'add' : 'remove'}EventListener`](
        event,
        this.preventDefault.bind(this),
        passiveSupported ? <any>{ passive: false } : null
      );
    });

    this.allowScrollElements.forEach(element => {
      if (enable) {
        element.addEventListener('click', this.handleScrollElementClick.bind(this));
        PreventOverScrolling(element);
      } else {
        element.removeEventListener('click', this.handleScrollElementClick.bind(this));
        ReEnableOverScrolling(element);
      }
    });

    if (enable) {
      window.addEventListener('keydown', this.preventDefaultKeyboard.bind(this));
    } else {
      window.removeEventListener('keydown', this.preventDefaultKeyboard.bind(this));
      this.allowScrollElements = [];
    }
  }

  private preventDefault(event: Event): void {
    if (!this.sourceIsScrollElementOrChild(<HTMLElement>event.srcElement)) {
      event.preventDefault();
    }
  }

  private sourceIsScrollElementOrChild(element: HTMLElement): boolean {
    if (this.allowScrollElements.length) {
      return !!this.allowScrollElements.find(e => e === element || e.contains(element));
    }

    return false;
  }

  private handleScrollElementClick(): void {
    this.scrollableAreaHasFocus = true;
  }

  private preventDefaultKeyboard(event: KeyboardEvent): void {
    if (
      !['INPUT', 'TEXTAREA'].includes((<HTMLElement>event.target).tagName) &&
      !this.scrollableAreaHasFocus &&
      USER_SCROLL_KEYBOARD_EVENTS.includes(event.keyCode)
    ) {
      event.preventDefault();
    }
  }

  private handleWindowClick(): void {
    this.scrollableAreaHasFocus = false;
  }
}
