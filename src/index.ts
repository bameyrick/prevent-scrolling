import { PreventOverScrolling, ReEnableOverScrolling } from 'prevent-overscrolling';
import { UAParser } from 'ua-parser-js';

import { USER_SCROLL_EVENTS, USER_SCROLL_KEYBOARD_EVENTS } from './user-scroll-events';
import { passiveSupported } from './passive-supported';

const IGNORE_PREVENT_WINDOW_SCROLL_BROWSERS = ['Mobile Safari', 'Safari', 'IE', 'Edge'];

const browser = new UAParser().getBrowser().name || '';
const win = window;

let allowScrollElements: HTMLElement[] = [];

let previousScrollX: number;
let previousScrollY: number;
let scrollableAreaHasFocus = false;
let scrollingPrevented = false;

win.addEventListener('click', handleWindowClick);

/**
 * Prevents scrolling anywhere except for optimal elements passed to the allowScrollingOn parameter
 */
export function PreventScrolling(allowScrollingOn?: HTMLElement | HTMLElement[]): void {
  if (!scrollingPrevented) {
    scrollingPrevented = true;
    if (allowScrollingOn) {
      if (Array.isArray(allowScrollingOn)) {
        allowScrollElements = allowScrollingOn;
      } else {
        allowScrollElements = [allowScrollingOn];
      }
    }

    lockWindow();
    setScrollingEvents(true);
  }
}

/**
 * Re-enables scrolling everywhere
 */
export function ReEnableScrolling(): void {
  if (scrollingPrevented) {
    unlockWindow();
    setScrollingEvents(false);
    scrollingPrevented = false;
  }
}

/**
 * Sets the scrolling events on the window
 */
function setScrollingEvents(enable: boolean): void {
  USER_SCROLL_EVENTS.forEach(event => {
    if (enable) {
      // tslint:disable-next-line:no-any
      win.addEventListener(event, preventDefault, passiveSupported ? { passive: false } as any : null);
    } else {
      // tslint:disable-next-line:no-any
      win.removeEventListener(event, preventDefault, passiveSupported ? { passive: false } as any : null);
    }
  });

  allowScrollElements.forEach(element => {
    if (enable) {
      element.addEventListener('click', handleScrollElementClick);
      PreventOverScrolling(element);
    } else {
      element.removeEventListener('click', handleScrollElementClick);
      ReEnableOverScrolling(element);
    }
  });

  if (enable) {
    win.addEventListener('keydown', preventDefaultKeyboard);
  } else {
    win.removeEventListener('keydown', preventDefaultKeyboard);
    allowScrollElements = [];
  }
}

/**
 * Prevents default behaviour on an event if the source is not a scroll element or child of a scroll element
 */
function preventDefault(event: Event): void {
  if (!sourceIsScrollElementOrChild(event.target as HTMLElement)) {
    event.preventDefault();
  }
}

/**
 * Checks whether the given element is a scroll element or child of a scroll element
 */
function sourceIsScrollElementOrChild(element: HTMLElement): boolean {
  if (allowScrollElements.length) {
    return !!allowScrollElements.find(e => e === element || e.contains(element));
  }
  return false;
}

/**
 * Prevents default behaviour for a keyboard scroll event
 */
function preventDefaultKeyboard(event: KeyboardEvent): void {
  const keyCode = event.code;
  const source = event.target as HTMLElement;

  if (
    source.tagName !== 'INPUT' &&
    source.tagName !== 'TEXTAREA' &&
    !scrollableAreaHasFocus &&
    USER_SCROLL_KEYBOARD_EVENTS.includes(keyCode)
  ) {
    event.preventDefault();
  }
}

/**
 * Prevents the window from scrolling
 */
function lockWindow(): void {
  previousScrollX = win.pageXOffset;
  previousScrollY = win.pageYOffset;

  if (!IGNORE_PREVENT_WINDOW_SCROLL_BROWSERS.includes(browser)) {
    win.addEventListener('scroll', setWindowScroll);
  }
}

/**
 * Allows the window to scroll again
 */
function unlockWindow(): void {
  win.removeEventListener('scroll', setWindowScroll);
}

/**
 * Sets the window scroll position back to its previous position
 */
function setWindowScroll(): void {
  win.scrollTo(previousScrollX, previousScrollY);
}

/**
 * Handles a user clicking on the window
 */
function handleWindowClick(): void {
  scrollableAreaHasFocus = false;
}

/**
 * Handles the user clicking on a scroll element
 */
function handleScrollElementClick(): void {
  scrollableAreaHasFocus = true;
}
