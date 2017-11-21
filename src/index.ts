import { USER_SCROLL_EVENTS } from './user-scroll-events';
import { passiveSupported } from './passive-supported';

const win = window;

let allowScrollElements: HTMLElement[] = [];

let previousScrollX: number;
let previousScrollY: number;

export function PreventScrolling(allowScrollingOn?: HTMLElement | HTMLElement[]): void {
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

export function ReEnableScrolling(): void {
	unlockWindow();
	setScrollingEvents(false);
}

function setScrollingEvents(enable: boolean): void {
	USER_SCROLL_EVENTS.forEach(event => {
		if (enable) {
			win.addEventListener(event, preventDefault, passiveSupported ? <any>{ passive: false } : null);
		} else {
			win.removeEventListener(event, preventDefault, passiveSupported ? <any>{ passive: false } : null);
		}
	});

	if (!enable) {
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
