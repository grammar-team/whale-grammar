import "@webcomponents/custom-elements";
import GrammarExtension from "./inspection_components/grammer-extension.element";
import GrammarMirror from "./inspection_components/grammar-mirror.element";

import styleCloneAttributes from "./inspection_components/clone.styles";

const EVENT_LISTENER = {
	mirrorEl: null,
	extensionEl: null,
	activeEl: null,

	_attachedInputListener: null,

	styleObserverCallback: function(mutation) {
		let isStyleChanged = false;
		mutation.forEach(e => {
			if(e.attributeName === `style`) {
				isStyleChanged = true;
			}
		});

		if(isStyleChanged)
			this._cloneElementStyles();
	},

	_cloneElementStyles: function() {
		this.mirrorEl.resetStyles();

		const computedStyles = window.getComputedStyle(this.activeEl);
		styleCloneAttributes.forEach(e => {
			const style = computedStyles.getPropertyValue(`${e}`);
			if(style.length > 0) {
				this.mirrorEl.setStyle(e, style);
			}
		});
	},
	_onInputTextArea: function(e) {
		const { value } = e.target;
		this.mirrorEl.setText(value);
	},
	onDocumentFocused: function() {
		if(this.mirrorEl === null) {
			this.mirrorEl = document.createElement(`grammar-mirror`);
			this.mirrorEl.dataset.generated = `whale-grammar`;
			document.documentElement.appendChild(this.mirrorEl);
		}

		const { activeElement } = document;
		if(this.activeEl && activeElement !== this.activeEl) {
			/* TODO: Destructor 만들어야함 */
			this.activeEl.removeEventListener(`input`, this._attachedInputListener)
			STYLE_OBSERVER.disconnect();
		}

		if(activeElement.nodeName === `TEXTAREA`) {
			this.activeEl = activeElement;
			this._cloneElementStyles();

			this._attachedInputListener = e => this._onInputTextArea(e);
			this.activeEl.addEventListener(`input`, this._attachedInputListener);
			STYLE_OBSERVER.observe(this.activeEl, {
				attributes: true
			});
		}
	}
};
const STYLE_OBSERVER = new MutationObserver(mutation => EVENT_LISTENER.styleObserverCallback(mutation));

window.addEventListener(`load`, function() {
	window.customElements.define(`grammar-extension`, GrammarExtension, { extends: `div` });
	window.customElements.define(`grammar-mirror`, GrammarMirror, { extends: `div` });
});
document.addEventListener(`DOMContentLoaded`, function() {
	document.addEventListener(`focusin`, e => {
		EVENT_LISTENER.onDocumentFocused(e);
	}, true);
});
