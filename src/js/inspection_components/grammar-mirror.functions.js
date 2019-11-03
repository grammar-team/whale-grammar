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

			const { positionList } = mirrorEl.measureTextPositions();
			extensionEl.addUnderlines(positionList);
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

		const { positionList, missingIndexList } = mirrorEl.measureTextPositions();
		extensionEl.modifyUnderlines(positionList, missingIndexList);

		extensionEl.setDotStatus({ status: `loading` });
		timeout = window.setTimeout(function() {
			port.postMessage({
				action: `inspectContent`,
				options: { text: value }
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
		options: { text: value }
	});
}
export function onTextAreaFocused({activeEl, mirrorEl, extensionEl, port}) {
	mirrorEl.reset();
	firstTextInspection(activeEl, mirrorEl, extensionEl, port);
	cloneElementStyles(activeEl, mirrorEl);

	const observer = attachStyleObserver(activeEl, mirrorEl, extensionEl);
	const eventListener = onTextAreaChanged(mirrorEl, extensionEl, port);
	activeEl.addEventListener(`input`, eventListener);
	activeEl.spellcheck = false;

	return { observer, eventListener };
}