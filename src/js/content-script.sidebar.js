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
			controller.grammarAreaEl.style.display = 'block';
			const [ text ] = segmentedText;
			controller.setText(text);
		}
		else {
			controller.grammarAreaEl.style.display = 'none';
			this.constructSegmentController(controller, segmentedText);
			this.inputTextToIFrame(controller, segmentedText);
		}
	},
	renderSliderSection: function(segmentedText) {
		const segmentEl = document.createElement('div');
		segmentEl.className = `glide`;
		const glideTrackEl = document.createElement('div');
		glideTrackEl.className = `glide__track`;
		glideTrackEl.setAttribute(`data-glide-el`, 'track');
		const glideWrapperEl = document.createElement('ul');
		glideWrapperEl.className = `glide__slides`;

		for(let i in segmentedText) {
			const textNode = document.createElement('li');
			textNode.className = `glide__slide`;
			textNode.innerHTML = `<iframe id="iframe-${i}" src="https://m.search.naver.com/search.naver?from=whale-grammar&query=맞춤법+검사기">`;
			glideWrapperEl.appendChild(textNode);
		}
		glideTrackEl.appendChild(glideWrapperEl);
		segmentEl.appendChild(glideTrackEl);

		const bulletEl = this.renderSliderButtonSection(segmentedText.length);
		segmentEl.appendChild(bulletEl);

		return segmentEl;
	},
	renderSliderButtonSection: function(num) {
		const bulletEl = document.createElement('div');
		bulletEl.className = `slider__bullets glide__bullets`;
		bulletEl.setAttribute(`data-glide-el`, `controls[nav]`);
		for(let i = 0; i < num; i++) {
			const buttonEl = document.createElement('button');
			buttonEl.className = `slider__bullet glide__bullet`;
			buttonEl.setAttribute(`data-glide-dir`, `=${i}`);
			bulletEl.appendChild(buttonEl);
		}

		return bulletEl;
	},
	constructSegmentController: function(controller, segmentedText) {
		const segmentEl = this.renderSliderSection(segmentedText);
		this.segmentTextNode = segmentEl;
		controller.segmentedTextEl.insertBefore(segmentEl, controller.segmentedTextEl.firstElementChild.nextSibling);
		this.glideSetup();
	},
	inputTextToIFrame(controller, segmentedText) {
		for(let i = 0; i < segmentedText.length; i++) {
			const iframeEl = controller.sectionEl.querySelector(`#iframe-${i}`);
			iframeEl.contentWindow.postMessage(`${segmentedText[i]}`, '*');
		}
	},

	glideSetup: function() {
		new Glide('.glide', {
			//swipeThreshold: 80
			type: 'carousel',
			autoplay: 0,
			animationDuration: 300,
			animationTimingFunc: 'linear',
			perView: 1,
			keyboard: false
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

	if(window.parent !== window) { // iframe check
		bodyEl.classList.add(`whale-grammar-iframe`);
		window.addEventListener(`message`,function() {
			window.parent.postMessage('iframeLoaded', '*');
		});
	}
	else {
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
	}
});



