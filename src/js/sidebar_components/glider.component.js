import Glide from "@glidejs/glide/dist/glide";

function renderSliderButtonSection(num) {
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
}
function renderSliderSection(segmentedText) {
	const segmentEl = document.createElement('div');
	segmentEl.className = `glide`;
	segmentEl.innerHTML =
		`<div class="glide__track" data-glide-el="track">
			<ul class="glide__slides"></ul>
		</div>`
	;

	const listEl = segmentEl.querySelector(`ul`);
	const frameList = [];
	for(let i in segmentedText) {
		const liEl = document.createElement('li');
		const frameEl = document.createElement(`iframe`);
		frameEl.src = `${location.toString()}`;
		frameEl.addEventListener(`load`, function(e) {
			e.target.contentWindow.postMessage({
				action: `setOriginalText`,
				options: { text: segmentedText[i] }
			}, `*`);
		});

		liEl.className = `glide__slide`;
		liEl.appendChild(frameEl);
		listEl.appendChild(liEl);

		frameList.push(frameEl);
	}

	const bulletEl = renderSliderButtonSection(segmentedText.length);
	segmentEl.appendChild(bulletEl);

	return { segmentEl, frameList };
}
function glideSetup() {
	const glide = new Glide('.glide', {
		//swipeThreshold: 80
		type: 'carousel',
		autoplay: 0,
		animationDuration: 300,
		animationTimingFunc: 'linear',
		perView: 1,
		keyboard: false
	}).mount();

	return glide;
}

export function constructSegmentController(controller, segmentedText) {
	const { segmentEl, frameList } = renderSliderSection(segmentedText);

	controller.segmentedTextEl.insertBefore(segmentEl, controller.segmentedTextEl.firstElementChild.nextSibling);
	const glide = glideSetup();

	return { segmentEl, frameList, glide };
}