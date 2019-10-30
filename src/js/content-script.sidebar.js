import {
	isSidebar,
	transformDisplayComponents,
	constructComponentController
} from "./sidebar_components/ui.component";

const EVENT_LISTENER = {
	setOriginalText: function(options, controller) {
		const { text } = options;
		if(typeof text === typeof `string`) {
			controller.setText(text);
		}
	}
};

document.addEventListener(`DOMContentLoaded`, function() {
	if(isSidebar() === false) {
		return;
	}

	const bodyEl = document.querySelector(`body`);
	bodyEl.classList.add(`whale-grammar`);

	const sectionEl = document.querySelector(`#grammar_checker`);
	const controller = constructComponentController(sectionEl);
	transformDisplayComponents(sectionEl);

	const port = whale.runtime.connect({ name: `grammar-sidebar` });
	port.onMessage.addListener(message => {
		const { action, options } = message;
		if(
			EVENT_LISTENER.hasOwnProperty(action) &&
			typeof EVENT_LISTENER[action] === `function`
		) {
			EVENT_LISTENER[action](options, controller);
		}
	});
});