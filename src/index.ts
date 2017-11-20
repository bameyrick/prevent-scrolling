import { USER_SCROLL_EVENTS, USER_SCROLL_KEYBOARD_EVENTS } from './user-scroll-events';

const win = window;

let allowScrollElements: HTMLElement[] = [];

let previousScrollX: number;
let previousScrollY: number;

export function PreventScrolling(allowScrollingOn: HTMLElement | HTMLElement[]): void {
	if (Array.isArray(allowScrollingOn)) {
		allowScrollElements = allowScrollingOn;
	} else {
		allowScrollElements = [allowScrollingOn];
	}

	lockWindow();
	setScrollingEvents(true);
}

export function ReEnableScrolling(): void {
	unlockWindow();
	setScrollingEvents(false);
}

function setScrollingEvents(enable: boolean): void {
	USER_SCROLL_EVENTS.forEach(event => {
		if (enable) {
			win.addEventListener(event, preventDefault);
		} else {
			win.removeEventListener(event, preventDefault);
		}
	});

	if (enable) {
		win.addEventListener('keydown', preventDefaultKeyboard);
	} else {
		win.removeEventListener('keydown', preventDefaultKeyboard);
		allowScrollElements = [];
	}
}

function preventDefault(event: Event): void {
	const source = <HTMLElement>event.srcElement;

	if (!sourceIsScrollElementOrChild(source)) {
		event.preventDefault();
	}
}

function sourceIsScrollElementOrChild(element: HTMLElement): boolean {
	if (allowScrollElements.length) {
		return !!allowScrollElements.find(e => e === element || e.contains(element));
	}
	return false;
}

function preventDefaultKeyboard(event: KeyboardEvent): void {
	const keyCode = event.keyCode;
	const tagName = (<HTMLElement>event.srcElement).tagName.toLowerCase();

	if (tagName !== 'input' && tagName !== 'textbox' && USER_SCROLL_KEYBOARD_EVENTS.includes(keyCode)) {
		event.preventDefault();
	}
}

function lockWindow(): void {
	previousScrollX = win.pageXOffset;
	previousScrollY = win.pageYOffset;

	win.addEventListener('scroll', setWindowScroll);
}

function unlockWindow(): void {
	win.removeEventListener('scroll', setWindowScroll);
}

function setWindowScroll(): void {
	win.scrollTo(previousScrollX, previousScrollY);
}
