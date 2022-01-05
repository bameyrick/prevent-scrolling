import { UAParser } from 'ua-parser-js';
import { PreventOverScrolling, ReEnableOverScrolling } from 'prevent-overscrolling';
import { Enum } from 'enum-keys-values-entries';

import { passiveSupported } from './passive-supported';
import { MouseEvent } from './mouse-event';
import { Key } from './keycodes';
import { isNullOrUndefined } from '@qntm-code/utils';

export const MOUSE_SCROLL_EVENTS: MouseEvent[] = Enum.values(MouseEvent);
export const KEYBOARD_SCROLL_KEYS: Key[] = Enum.values(Key);
export const IGNORE_PREVENT_WINDOW_SCROLL_BROWSERS = ['Mobile Safari', 'Safari', 'IE', 'Edge'];

/**
 * Whether the scrollable area is currently focused
 */
let scrollableAreaHasFocus: boolean = false;

/**
 * Whether the scrolling has been prevented
 */
let scrollingPrevented: boolean;

/**
 * The previous scroll x value
 */
let previousScrollX: number;

/**
 * The previous scroll y value
 */
let previousScrollY: number;

/**
 * Elements to allow scrolling on
 */
let allowScrollElements: HTMLElement[] = [];

/**
 * Whether or not we can actually prevent user scrolling
 */
const mayPreventWindowScroll: boolean = !IGNORE_PREVENT_WINDOW_SCROLL_BROWSERS.includes(new UAParser().getBrowser().name || '');

window.addEventListener('click', () => (scrollableAreaHasFocus = false));

export function PreventScrolling(allowScrollingOn?: HTMLElement | HTMLElement[]): void {
  if (scrollingPrevented) {
    return;
  }

  scrollingPrevented = true;

  if (allowScrollingOn) {
    allowScrollElements = Array.isArray(allowScrollingOn) ? allowScrollingOn : [allowScrollingOn];
  }

  lockWindow();
  setScrollingEvents(true);
}

export function ReEnableScrolling(): void {
  if (scrollingPrevented) {
    unlockWindow();
    setScrollingEvents(false);
    scrollingPrevented = false;
  }
}

function lockWindow(): void {
  previousScrollX = window.pageXOffset;
  previousScrollY = window.pageYOffset;

  if (mayPreventWindowScroll) {
    window.addEventListener('scroll', setWindowScroll);
  }
}

function unlockWindow(): void {
  window.removeEventListener('scroll', setWindowScroll);
}

function setWindowScroll(): void {
  if (!isNullOrUndefined(previousScrollX) && !isNullOrUndefined(previousScrollY)) {
    window.scrollTo(previousScrollX, previousScrollY);
  }
}

function setScrollingEvents(enable: boolean): void {
  MOUSE_SCROLL_EVENTS.forEach(event => {
    window[`${enable ? 'add' : 'remove'}EventListener`](event, preventDefault, passiveSupported ? <any>{ passive: false } : null);
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
    window.addEventListener('keydown', preventDefaultKeyboard);
  } else {
    window.removeEventListener('keydown', preventDefaultKeyboard);
    allowScrollElements = [];
  }
}

function preventDefault(event: Event): void {
  if (!sourceIsScrollElementOrChild(<HTMLElement>event.target)) {
    event.preventDefault();
  }
}

function sourceIsScrollElementOrChild(element: HTMLElement): boolean {
  if (allowScrollElements.length) {
    return !!allowScrollElements.find(e => e === element || e.contains(element));
  }

  return false;
}

function handleScrollElementClick(): void {
  scrollableAreaHasFocus = true;
}

function preventDefaultKeyboard(event: KeyboardEvent): void {
  if (
    !['INPUT', 'TEXTAREA'].includes((<HTMLElement>event.target).tagName) &&
    !scrollableAreaHasFocus &&
    KEYBOARD_SCROLL_KEYS.includes(event.key as Key)
  ) {
    event.preventDefault();
  }
}
