import styleCloneAttributes from "./clone.styles";

export function renderMirrorElement() {
	const mirrorEl = document.createElement(`grammar-mirror`);
	mirrorEl.dataset.generated = `whale-grammar`;

	return mirrorEl;
}

function cloneElementStyles(targetEl, mirrorEl) {
	const computedStyles = window.getComputedStyle(targetEl);
	styleCloneAttributes.forEach(e => {
		const style = computedStyles.getPropertyValue(`${e}`);
		if(style.length > 0) {
			mirrorEl.setStyle(e, style);
		}
	});
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
		}
	});

	observer.observe(targetEl, {
		attributes: true
	});

	return observer;
}
function onTextAreaChanged(mirrorEl, extensionEl, port) {
	let timeout;
	return function(e) {
		const { value } = e.target;
		mirrorEl.setText(value);

		clearTimeout(timeout);
		if(!value) {
			extensionEl.resetUnderlines();
			return;
		}

		extensionEl.setDotStatus({ status: `loading` });
		timeout = window.setTimeout(function() {
			port.postMessage({
				action: `inspectContent`,
				options: { text: value }
			});
		}, 1600);
	}
}
export function onTextAreaFocused({activeEl, mirrorEl, extensionEl, port}) {
	mirrorEl.reset();

	mirrorEl.setText(activeEl.value);
	cloneElementStyles(activeEl, mirrorEl);
	const observer = attachStyleObserver(activeEl, mirrorEl, extensionEl);

	const eventListener = onTextAreaChanged(mirrorEl, extensionEl, port);
	activeEl.addEventListener(`input`, eventListener);
	activeEl.spellcheck = false;

	return { observer, eventListener };
}