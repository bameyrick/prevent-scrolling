import { PreventOverScrolling, ReEnableOverScrolling } from 'prevent-overscrolling';

import { USER_SCROLL_EVENTS, USER_SCROLL_KEYBOARD_EVENTS } from './user-scroll-events';

let allowScrollElements: HTMLElement[] = [];

export function PreventScrolling(allowScrollingOn: HTMLElement | HTMLElement[]): void {
	if (Array.isArray(allowScrollingOn)) {
		allowScrollElements = allowScrollingOn;
	} else {
		allowScrollElements = [allowScrollingOn];
	}

	setScrollingEvents(true);
}

export function ReEnableScrolling(): void {
	setScrollingEvents(false);
}

function setScrollingEvents(enable: boolean): void {
	USER_SCROLL_EVENTS.forEach(event => {
		if (enable) {
			document.addEventListener(event, preventDefault);
		} else {
			document.removeEventListener(event, preventDefault);
		}
	});

	if (enable) {
		document.addEventListener('keydown', preventDefaultKeyboard);
	} else {
		document.removeEventListener('keydown', preventDefaultKeyboard);
	}

	if (allowScrollElements.length) {
		setOverScrollEvents(enable);
	}
}

function preventDefault(event: Event): void {
	const source = <HTMLElement>event.srcElement;

	if (!(!!allowScrollElements.length && sourceIsScrollElementOrChild(source))) {
		event.preventDefault();
	}
}

function sourceIsScrollElementOrChild(element: HTMLElement): boolean {
	return !!allowScrollElements.find(e => e === element || e.contains(element));
}

function preventDefaultKeyboard(event: KeyboardEvent): void {
	const keyCode = event.keyCode;
	const tagName = (<HTMLElement>event.srcElement).tagName.toLowerCase();

	if (tagName !== 'input' && tagName !== 'textbox' && USER_SCROLL_KEYBOARD_EVENTS.includes(keyCode)) {
		event.preventDefault();
	}
}

function setOverScrollEvents(enable: boolean): void {
	allowScrollElements.forEach(element => {
		if (enable) {
			PreventOverScrolling(element);
		} else {
			ReEnableOverScrolling(element);
		}
	});
}
