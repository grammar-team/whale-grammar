import { constructComponentController } from "./ui.component";

const EVENT_LISTENER = {
	controller: null,

	initializeListener: function() {
		if(this.controller === null) {
			const sectionEl = document.querySelector(`#grammar_checker`);
			this.controller = constructComponentController(sectionEl);
		}
	},
	setOriginalText: function(options, { controller }) {
		const { text } = options;
		controller.setText(text);
	}
};

export function onIframeLoaded(bodyEl, controller) {
	bodyEl.classList.add(`whale-grammar-iframe`);
	window.addEventListener(`message`,function(e) {
		const { action, options } = e.data;
		if(
			EVENT_LISTENER.hasOwnProperty(action) &&
			typeof EVENT_LISTENER[action] === `function`
		) {
			EVENT_LISTENER[action](options, controller);
		}
	});

	window.parent.postMessage('iframeLoaded', '*');
}