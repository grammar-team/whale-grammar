import "@webcomponents/custom-elements";
import GrammarExtension from "./inspection_components/grammar-extension.element";
import GrammarMirror from "./inspection_components/grammar-mirror.element";

import { isSidebar } from "./sidebar_components/ui.component";
import { cloneElementStyles } from "./inspection_components/clone.styles";
import { addURLtoBlacklist, isURLinBlacklist } from "./inspection_components/blacklist.component";
import {
	renderMirrorElement, onTextAreaFocused, onEditableElementFocused
} from "./inspection_components/grammar-mirror.functions";
import {
	renderExtensionElement,
	findProperParent
} from "./inspection_components/grammar-extension.functions";

const PORT_LISTENER = {
	startInspection: function(options, { extensionEl }) {
		extensionEl.setDotStatus({ status: `loading` });
	},
	inspectionResult: function(options, { mirrorEl, extensionEl, activeEl }) {
		cloneElementStyles(activeEl, mirrorEl);

		const { error_count, error_words } = options;
		const { positionList } = mirrorEl.measureTextPositions(error_words);

		const { scrollTop, scrollLeft } = mirrorEl.getScrollPosition();
		extensionEl.setSizePosition(activeEl);
		extensionEl.addUnderlines(positionList, { scrollTop, scrollLeft });
		extensionEl.setDotStatus({ error_count, status: `default` });
	},
	inspectionTooLong: function(options, { extensionEl }) {
		extensionEl.setDotStatus({ status: `too-long` });
	},
	inspectionError: function(options, { extensionEl }) {
		extensionEl.setDotStatus({ status: `error` });
	}
};
const EVENT_LISTENER = {
	mirrorEl: null,
	extensionEl: null,
	lastActiveEl: null,

	port: null,
	styleObserver: null,
	inputListener: null,
	scrollListener: null,

	_isEditableNode: function(nodeEl) {
		if(
			nodeEl.nodeName === `TEXTAREA` ||
			nodeEl.contentEditable === `${true}`
		) {
			return true;
		}

		return false;
	},
	_isNeedReset: function(nodeEl) {
		if(
			this.lastActiveEl &&
			this._isEditableNode(nodeEl) &&
			nodeEl !== this.lastActiveEl
		)
			return true;

		return false;
	},
	__resetThings: function() {
		if(this.styleObserver) { this.styleObserver.disconnect(); }
		if(this.extensionEl) this.extensionEl.remove();

		delete this.lastActiveEl.dataset.grammar;
		this.lastActiveEl.removeEventListener(`input`, this.inputListener);
		this.lastActiveEl.removeEventListener(`scroll`, this.scrollListener);
	},
	_resetThings: function(activeElement) {
		if(this.lastActiveEl === null) {
			this._injectExtensionElement(activeElement);
		} else if(this._isNeedReset(activeElement)) {
			this.__resetThings();
			this._injectExtensionElement(activeElement);
		}

		activeElement.dataset.grammar = `true`;
		this.lastActiveEl = activeElement;
	},
	_injectExtensionElement: function(activeElement) {
		this.extensionEl = renderExtensionElement();
		this.extensionEl.setSizePosition(activeElement);

		if(activeElement !== document.body) {
			const parentEl = findProperParent(activeElement.parentElement);
			parentEl.appendChild(this.extensionEl);
		} else {
			activeElement.parentElement.appendChild(this.extensionEl);
		}
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
					extensionEl: this.extensionEl,
					activeEl: this.lastActiveEl
				});
			}
		});
	},
	destructListener: function() {
		this.mirrorEl.remove();
		this.extensionEl.remove();
		this.port.disconnect();
		this.__resetThings();
	},
	onDocumentFocused: function() {
		const { activeElement } = document;
		if(
			this._isEditableNode(activeElement) === false ||
			activeElement.offsetHeight < 50
		) {
			return;
		}
		if(activeElement.dataset.grammar === `true`) {
			return;
		}

		this._resetThings(activeElement);
		const options = {
			activeEl: activeElement,
			mirrorEl: this.mirrorEl,
			extensionEl: this.extensionEl,
			port: this.port
		};

		if(activeElement.nodeName === `TEXTAREA`) {
			const { styleObserver, inputEventListener, scrollEventListener } = onTextAreaFocused(options);
			this.styleObserver = styleObserver;
			this.inputListener = inputEventListener;
			this.scrollListener = scrollEventListener;
		} else if(activeElement.nodeName !== `INPUT`) {
			const { styleObserver, inputEventListener, scrollEventListener } = onEditableElementFocused(options);
			this.styleObserver = styleObserver;
			this.inputListener = inputEventListener;
			this.scrollListener = scrollEventListener;
		}
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

	const { hostname } = location;
	isURLinBlacklist(hostname).then(isBlocked => {
		if(isBlocked === true) {
			return;
		}

		const eventListener = e => EVENT_LISTENER.onDocumentFocused(e);
		EVENT_LISTENER.initializeListener();
		document.addEventListener(`focusin`, eventListener, true);
		window.addEventListener(`message`, e => {
			const { action } = e.data;
			if(action === `inspectionPowerOff`) {
				if(confirm(`${hostname} 에서\n맞춤법 검사를 비활성화 하시겠습니까?`)) {
					document.removeEventListener(`focusin`, eventListener, true);
					EVENT_LISTENER.destructListener();
					addURLtoBlacklist(hostname);
				}
			}
		});
	});
});