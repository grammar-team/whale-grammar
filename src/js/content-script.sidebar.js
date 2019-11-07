import {
	isSidebar,
	transformDisplayComponents,
	constructComponentController
} from "./sidebar_components/ui.component";
import {
	constructSegmentController
} from "./sidebar_components/glider.component";

const EVENT_LISTENER = {
	iframeEl : null,
	setOriginalText: function(options, controller) {
		const { segmentedText } = options;

		if (this.iframeEl !== null) {
			controller.segmentedTextEl.removeChild(this.iframeEl);
			this.iframeEl = null;
		}

		if (segmentedText.length === 1) {
			controller.grammarAreaEl.style.display = 'block';
			const [text] = segmentedText;
			if(document.readyState === 'complete') {
				controller.setText(text);
			} else {
				controller.setTextMutation(text);
			}

		} else {
			controller.grammarAreaEl.style.display = 'none';

			const { segmentEl } = constructSegmentController(controller, segmentedText);
			this.iframeEl = segmentEl;
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
		window.addEventListener(`message`, function(e) {
			const { action, options } = e.data;
			if(
				EVENT_LISTENER.hasOwnProperty(action) &&
				typeof EVENT_LISTENER[action] === `function`
			) {
				EVENT_LISTENER[action](options, controller);
			}
		});
	}
});



