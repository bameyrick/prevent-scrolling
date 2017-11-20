import { USER_SCROLL_EVENTS } from './user-scroll-events';

let allowScrollElements: HTMLElement[] = [];

const win = window;

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
	const tagName = (<HTMLElement>event.srcElement).tagName.toLowerCase();

	if (tagName !== 'input' && tagName !== 'textbox') {
		event.preventDefault();
	}
}

function setOverScrollEvents(enable: boolean): void {
	allowScrollElements.forEach(element => {
		USER_SCROLL_EVENTS.forEach(event => {
			if (enable) {
				element.addEventListener(event, () => handleOverScroll(element));
			} else {
				element.removeEventListener(event, () => handleOverScroll(element));
			}
		});
	});
}

function handleOverScroll(element: HTMLElement): void {
	const scrollTop = element.scrollTop;

	if (scrollTop === 0) {
		element.scrollTop = 1;
	} else if (scrollTop + element.offsetHeight === element.scrollHeight) {
		element.scrollTop = scrollTop - 1;
	}
}
