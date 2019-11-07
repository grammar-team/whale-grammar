import {
	isSidebar,
	transformDisplayComponents,
	constructComponentController
} from "./sidebar_components/ui.component";
import {
	constructSegmentController
} from "./sidebar_components/glider.component";

const EVENT_LISTENER = {
	segmentTextNode : null,
	setOriginalText: function(options, controller) {
		const { segmentedText } = options;

		if(this.segmentTextNode !== null) {
			controller.segmentedTextEl.removeChild(this.segmentTextNode);
			this.segmentTextNode = null;
		}

		if(segmentedText.length === 1) {
			controller.grammarAreaEl.style.display = 'block';
			const [ text ] = segmentedText;
			controller.setText(text);
		}
		else {
			controller.grammarAreaEl.style.display = 'none';

			const { segmentEl, frameList, glide } = constructSegmentController(controller, segmentedText);
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

	if(window.parent === window) {
		const portKey = parseInt(`${Math.random() * 10000}`, 10);
		const port = whale.runtime.connect({ name: `grammar-sidebar-${portKey}` });
		port.onMessage.addListener(message => {
			const { action, options } = message;
			if(
				EVENT_LISTENER.hasOwnProperty(action) &&
				typeof EVENT_LISTENER[action] === `function`
			) {
				EVENT_LISTENER[action](options, controller);
			}
		});
	}
});



