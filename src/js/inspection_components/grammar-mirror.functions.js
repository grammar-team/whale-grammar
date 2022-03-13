import { cloneElementStyles, cloneChildElementStyles } from "./clone.styles";

export function renderMirrorElement() {
	const mirrorEl = document.createElement(`grammar-mirror`);
	mirrorEl.dataset.generated = `whale-grammar`;

	return mirrorEl;
}

function attachStyleObserver(targetEl, mirrorEl, extensionEl) {
	const observer = new window.MutationObserver(mutation => {
		let isStyleChanged = false;
		mutation.forEach(e => {
			if(e.attributeName === `style`) {
				isStyleChanged = true;
			}
		});

		if(isStyleChanged) {
			cloneElementStyles(targetEl, mirrorEl);
			extensionEl.setSizePosition(targetEl);

			const { scrollTop, scrollLeft } = mirrorEl.getScrollPosition();
			const { positionList } = mirrorEl.measureTextPositions();
			extensionEl.addUnderlines(positionList, { scrollTop, scrollLeft });
		}
	});

	observer.observe(targetEl, {
		attributes: true
	});

	return observer;
}
function onScrolled(mirrorEl, extensionEl) {
	return function(e) {
		mirrorEl.setScrollPosition(e.target);

		const { scrollTop, scrollLeft } = mirrorEl.getScrollPosition();
		const { positionList } = mirrorEl.measureTextPositions();
		extensionEl.addUnderlines(positionList, { scrollTop, scrollLeft });
	}
}

function onTextAreaChanged(mirrorEl, extensionEl, port) {
	let timeout;
	return function(e) {
		const { value } = e.target;
		mirrorEl.setText(value);

		clearTimeout(timeout);
		if(!value) {
			extensionEl.reset();
			return;
		}

		const { scrollTop, scrollLeft } = mirrorEl.getScrollPosition();
		const { positionList } = mirrorEl.measureTextPositions();
		extensionEl.addUnderlines(positionList, { scrollTop, scrollLeft });

		extensionEl.setDotStatus({ status: `loading` });
		timeout = window.setTimeout(function() {
			port.postMessage({
				action: `inspectContent`,
				options: {
					text: value,
					origin: window.location.origin,
				}
			});
		}, 1600);
	}
}
function firstTextInspection(targetEl, mirrorEl, extensionEl, port) {
	const { value } = targetEl;
	mirrorEl.setText(value);

	if(!value) {
		extensionEl.resetUnderlines();
		return;
	}

	extensionEl.setDotStatus({ status: `loading` });
	port.postMessage({
		action: `inspectContent`,
		options: {
			text: value,
			origin: location.origin
		}
	});
}
export function onTextAreaFocused({activeEl, mirrorEl, extensionEl, port}) {
	mirrorEl.reset();
	mirrorEl.setScrollPosition(activeEl);

	cloneElementStyles(activeEl, mirrorEl);
	firstTextInspection(activeEl, mirrorEl, extensionEl, port);

	const styleObserver = attachStyleObserver(activeEl, mirrorEl, extensionEl);
	const inputEventListener = onTextAreaChanged(mirrorEl, extensionEl, port);
	const scrollEventListener = onScrolled(mirrorEl, extensionEl);
	activeEl.addEventListener(`input`, inputEventListener);
	activeEl.addEventListener(`scroll`, scrollEventListener);
	activeEl.spellcheck = false;

	return { styleObserver, inputEventListener, scrollEventListener };
}

function onEditableChanged(mirrorEl, extensionEl, activeEl, port) {
	let timeout;
	return function(e) {
		const { innerText, innerHTML } = e.target;
		mirrorEl.setHTML(innerHTML);

		clearTimeout(timeout);
		if(!innerText) {
			extensionEl.reset();
			return;
		}

		cloneChildElementStyles(activeEl, mirrorEl);
		const { scrollTop, scrollLeft } = mirrorEl.getScrollPosition();
		const { positionList } = mirrorEl.measureTextPositions();
		extensionEl.addUnderlines(positionList, { scrollTop, scrollLeft });

		extensionEl.setDotStatus({ status: `loading` });
		timeout = window.setTimeout(function() {
			port.postMessage({
				action: `inspectContent`,
				options: {
					text: innerText,
					origin: location.origin,
				}
			});
		}, 1600);
	};
}
function firstElementInspection(targetEl, mirrorEl, extensionEl, port) {
	const { innerText, innerHTML } = targetEl;
	if(!innerText) {
		extensionEl.resetUnderlines();
		mirrorEl.setText(``);

		return;
	}

	mirrorEl.setHTML(innerHTML);
	extensionEl.setDotStatus({ status: `loading` });
	port.postMessage({
		action: `inspectContent`,
		options: {
			text: innerText,
			origin: location.origin,
		}
	});
}
export function onEditableElementFocused({ activeEl, mirrorEl, extensionEl, port }) {
	mirrorEl.reset();
	mirrorEl.setScrollPosition(activeEl);

	cloneElementStyles(activeEl, mirrorEl);
	firstElementInspection(activeEl, mirrorEl, extensionEl, port);

	const styleObserver = attachStyleObserver(activeEl, mirrorEl, extensionEl);
	const inputEventListener = onEditableChanged(mirrorEl, extensionEl, activeEl, port);
	const scrollEventListener = onScrolled(mirrorEl, extensionEl);
	activeEl.addEventListener(`input`, inputEventListener);
	activeEl.addEventListener(`scroll`, scrollEventListener);
	activeEl.spellcheck = false;

	return { styleObserver, inputEventListener, scrollEventListener };
}
