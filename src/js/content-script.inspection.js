import "@webcomponents/custom-elements";
import GrammarExtension from "./inspection_components/grammer-extension.element";
import GrammarMirror from "./inspection_components/grammar-mirror.element";

import { isSidebar } from "./sidebar_components/ui.component";
import { renderMirrorElement, onTextAreaFocused } from "./inspection_components/grammar-mirror.functions";
import { renderExtensionElement, findProperParent } from "./inspection_components/grammar-extension.functions";

const PORT_LISTENER = {
	inspectContentResult: function(options, { port, mirrorEl, extensionEl }) {
		console.log(`listen:inspectContentResult`, options);
	}
};
const EVENT_LISTENER = {
	mirrorEl: null,
	extensionEl: null,
	lastActiveEl: null,

	port: null,
	textAreaObserver: null,
	textAreaInputListener: null,

	_isNeedReset: function(nodeEl) {
		if(
			this.lastActiveEl &&
			(
				nodeEl.nodeName === `TEXTAREA` ||
				nodeEl.contentEditable === `${true}`
			) &&
			nodeEl !== this.lastActiveEl
		)
			return true;

		return false;
	},
	_resetThings: function(activeElement) {
		if(this.lastActiveEl === null) {
			this._injectExtensionElement(activeElement);
		} else if(this._isNeedReset(activeElement)) {
			if(this.textAreaObserver) { this.textAreaObserver.disconnect(); }

			if(this.extensionEl) this.extensionEl.remove();
			this._injectExtensionElement(activeElement);

			this.lastActiveEl.removeEventListener(`input`, this.textAreaInputListener);
		}
	},
	_injectExtensionElement: function(activeElement) {
		this.extensionEl = renderExtensionElement();
		const parentEl = findProperParent(activeElement.parentElement);
		parentEl.appendChild(this.extensionEl);
	},
	initializeListener: function() {
		this.mirrorEl = renderMirrorElement();
		document.documentElement.appendChild(this.mirrorEl);

		this.port = whale.runtime.connect({ name: `grammar-inspection` });
		this.port.onMessage.addListener(message => {
			const { action, options } = message;
			if(
				PORT_LISTENER.hasOwnProperty(action) &&
				typeof PORT_LISTENER[action] === `function`
			) {
				PORT_LISTENER[action](options, {
					port: this.port,
					mirrorEl: this.mirrorEl,
					extensionEl: this.extensionEl
				});
			}
		});
	},
	onDocumentFocused: function() {
		const { activeElement } = document;

		this._resetThings(activeElement);
		if(activeElement.nodeName === `TEXTAREA`) {
			const { observer, eventListener } = onTextAreaFocused({
				activeEl: activeElement,
				mirrorEl: this.mirrorEl,
				extensionEl: this.extensionEl,
				port: this.port
			});
			this.textAreaObserver = observer;
			this.textAreaInputListener = eventListener;
		}

		this.lastActiveEl = activeElement;
	}
};

window.addEventListener(`load`, function() {
	window.customElements.define(`grammar-extension`, GrammarExtension, { extends: `div` });
	window.customElements.define(`grammar-mirror`, GrammarMirror, { extends: `div` });
});
document.addEventListener(`DOMContentLoaded`, function() {
	if(isSidebar() === true) {
		return;
	}

	EVENT_LISTENER.initializeListener();
	document.addEventListener(`focusin`, e => {
		EVENT_LISTENER.onDocumentFocused(e);
	}, true);
});
