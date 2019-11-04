import {
	isSidebar,
	transformDisplayComponents,
	constructComponentController
} from "./sidebar_components/ui.component";

const EVENT_LISTENER = {
	segmentTextNode : null,
	setOriginalText: function(options, controller) {
		const { segmentedText } = options;
		if(segmentedText.length === 1) {
			const [ text ] = segmentedText;
			controller.setText(text);
		}
		else {
			controller.setText(`개발필요`);
			this.constructSegmentController(controller, segmentedText);
		}
	},

	renderTextSegmentSection: function(segmentedText) {
		const segmentEl = document.createElement(`section`);
		segmentEl.className = `text-segment`;

		for(let i in segmentedText) {
			const textNode = document.createElement(`div`);
			textNode.className = `section-content`;
			textNode.innerHTML = `
				<div class="description">
					${segmentedText[i]}
				</div>
			`;

			segmentEl.appendChild(textNode);
		}

		return segmentEl;
	},

	constructSegmentController: function(controller, segmentedText) {
		if(this.segmentTextNode !== null) {
			controller.segmentedTextEl.removeChild(this.segmentTextNode);
			this.segmentTextNode = null;
		}

		const segmentEl = this.renderTextSegmentSection(segmentedText);
		this.segmentTextNode = segmentEl;

		controller.segmentedTextEl.insertBefore(segmentEl, controller.segmentedTextEl.firstElementChild.nextSibling);
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

	const portKey = parseInt(Math.random() * 10000, 10);
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
});