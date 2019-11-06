import {
	isSidebar,
	transformDisplayComponents,
	constructComponentController
} from "./sidebar_components/ui.component";

import Glide from '@glidejs/glide'

const EVENT_LISTENER = {
	segmentTextNode : null,
	setOriginalText: function(options, controller) {
		const { segmentedText } = options;

		if(this.segmentTextNode !== null) {
			controller.segmentedTextEl.removeChild(this.segmentTextNode);
			this.segmentTextNode = null;
		}

		if(segmentedText.length === 1) {
			const [ text ] = segmentedText;
			controller.setText(text);
		}
		else {
			controller.setText(`아무것도 수행기능 없음`);
			//this.constructSegmentController(controller, segmentedText);
		}
	},
	renderSliderSection: function(segmentedText) {
		const segmentEl = document.createElement(`div`);
		segmentEl.className = `glide`;
		const glideTrackEl = document.createElement('div');
		glideTrackEl.className = `glide__track`;
		glideTrackEl.setAttribute(`data-glide-el`, `track`);
		const glideWrapperEl = document.createElement('ul');
		glideWrapperEl.className = `glide__slides`;

		for(let i in segmentedText) {
			const textNode = document.createElement(`li`);
			textNode.className = `glide__slide`;
			textNode.innerHTML = `<iframe src=\"https://m.search.naver.com/search.naver?from=whale-grammar&query=맞춤법+검사기\">`;
			glideWrapperEl.appendChild(textNode);
			console.log('textNode:', textNode);
		}
		console.log('glideWrapperEl', glideWrapperEl);
		glideTrackEl.appendChild(glideWrapperEl);
		segmentEl.appendChild(glideTrackEl);

		return segmentEl;
	},
	renderTextSegmentSection: function(segmentedText) {
		const segmentEl = document.createElement(`div`);
		segmentEl.className = `glide`;
		const glideTrackEl = document.createElement('div');
		glideTrackEl.className = `glide__track`;
		glideTrackEl.setAttribute(`data-glide-el`, `track`);
		const glideWrapperEl = document.createElement('ul');
		glideWrapperEl.className = `glide__slides`;

		for(let i in segmentedText) {
			const textNode = document.createElement(`li`);
			textNode.className = `glide__slide`;
			textNode.innerHTML = `${segmentedText[i]}`;

			glideWrapperEl.appendChild(textNode);
		}
		glideTrackEl.appendChild(glideWrapperEl);
		segmentEl.appendChild(glideTrackEl);

		return segmentEl;
	},

	constructSegmentController: function(controller, segmentedText) {
		//const segmentEl = this.renderTextSegmentSection(segmentedText);
		//this.segmentTextNode = segmentEl;
		const segmentEl = this.renderSliderSection(segmentedText);
		this.segmentTextNode = segmentEl;

		controller.segmentedTextEl.insertBefore(segmentEl, controller.segmentedTextEl.firstElementChild.nextSibling);
		this.glideSetup();
	},

	glideSetup: function() {
		//new Glide('.glide').mount(); // default setting
		new Glide('.glide', {
			type: 'carousel',
			autoplay: 0,
			animationDuration: 300,
			animationTimingFunc: 'linear',
			perView: 1
		}).mount();
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