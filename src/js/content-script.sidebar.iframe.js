import { isSidebarFrame, constructComponentController } from "./sidebar_components/ui.component";

const EVENT_LISTENER = {
	controller: null,

	initializeListener: function() {
		if(this.controller === null) {
			const sectionEl = document.querySelector(`#grammar_checker`);
			this.controller = constructComponentController(sectionEl);
		}
	},
	setOriginalText: function(options) {
		this.initializeListener();

		const { text } = options;
		this.controller.setTextMutation(text);
	}
};

let isDocumentLoaded = false;
(function() {
	if(isSidebarFrame() === false || window.parent === window) {
		return;
	}

	window.addEventListener(`message`, function(e) {
		const { action, options } = e.data;
		if(
			EVENT_LISTENER.hasOwnProperty(action) &&
			typeof EVENT_LISTENER[action] === `function`
		) {
			if(isDocumentLoaded === true) {
				EVENT_LISTENER[action](options);
			} else {
				document.addEventListener(`DOMContentLoaded`, () => EVENT_LISTENER[action](options));
			}
		}
	});
	document.addEventListener(`DOMContentLoaded`, function() {
		document.body.classList.add(`whale-grammar-iframe`);
		isDocumentLoaded = true;
	});
})();