class GrammarExtension extends HTMLElement {
	constructor() {
		super();

		this.attachShadow({
			mode: `open`,
			delegatesFocus: true
		});

		this.render = this.render.bind(this);
		this.reset = this.reset.bind(this);
		this.bindClickEvents = this.bindClickEvents.bind(this);
		this.setSizePosition = this.setSizePosition.bind(this);
		this.addUnderlines = this.addUnderlines.bind(this);
		this.resetUnderlines = this.resetUnderlines.bind(this);
		this.removeUnderline = this.removeUnderline.bind(this);

		this.render();
	}

	_getFiles() {
		return {
			cssFile: whale.runtime.getURL(`css/grammar-extension.element.css`),
			checkImg: whale.runtime.getURL(`image/default.png`),
			powerOffImg: whale.runtime.getURL(`image/power.svg`),
			loadingImg: whale.runtime.getURL(`image/loading.svg`),
			cautionImg: whale.runtime.getURL(`image/caution.svg`),
			errorImg: whale.runtime.getURL(`image/error.svg`)
		};
	}
	render() {
		const {
			cssFile, checkImg, powerOffImg,
			loadingImg, cautionImg, errorImg
		} = this._getFiles();

		this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="${cssFile}" />
			<div role="grammar-underline"></div>
			<div role="grammar-dot" style="visibility: hidden;">
				<a href="#" class="status" id="grammar-open">
					<img src="${checkImg}" alt="check" />
					<img src="${loadingImg}" alt="loading" />
					<img src="${cautionImg}" alt="too-long" />
					<img src="${errorImg}" alt="error" />
					<span role="grammar-error-count">0</span>
				</a>
				<div>
					<a href="#" class="power-off" id="grammar-off"><img src="${powerOffImg}" alt="power-off" /></a>
				</div>
			</div>
		`;

		this.underlineWrapEl = this.shadowRoot.querySelector(`[role="grammar-underline"]`);
		this.dotEl = this.shadowRoot.querySelector(`[role="grammar-dot"]`);
		this.errorCountEl = this.dotEl.querySelector(`[role="grammar-error-count"]`);
		this.bindClickEvents();
	}
	bindClickEvents() {
		const openEl = this.shadowRoot.querySelector(`#grammar-open`);

		openEl.addEventListener(`click`, e => {
			e.preventDefault();

			const { value, innerText } = this.targetEl;
			whale.runtime.sendMessage({
				action: `setOriginalText`,
				options: {
					text: value || innerText
				}
			});
		});

		const powerEl = this.shadowRoot.querySelector(`#grammar-off`);
		powerEl.addEventListener(`click`, e => {
			e.preventDefault();
			e.stopPropagation();

			window.postMessage({ action: `inspectionPowerOff`, options: {} }, location.origin);
		});
	}

	reset() {
		delete this.dotEl.dataset.status;
		delete this.dotEl.dataset.error;

		this.resetUnderlines();
		this.errorCountEl.innerText = ``;
	}

	setSizePosition(targetEl) {
		this.targetEl = targetEl;
		this.dataset.generated = `whale-grammar`;
		const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = targetEl;

		this.style.top = `${offsetTop}px`;
		this.style.left = `${offsetLeft}px`;

		this.underlineWrapEl.style.width = `${offsetWidth}px`;
		this.underlineWrapEl.style.height = `${offsetHeight}px`;

		this.dotEl.style.top = `${offsetHeight - 36}px`;
		this.dotEl.style.left = `${offsetWidth - 36}px`;
	}
	addUnderlines(underlineList, { scrollTop, scrollLeft }) {
		this.resetUnderlines();

		let lastIndex = 0, subIndex = 0;
		underlineList.forEach(rect => {
			const { height, width, left, top, index } = rect;
			const nodeEl = document.createElement(`span`);
			if(index !== lastIndex) {
				lastIndex = index;
				subIndex = 0;
			}

			nodeEl.dataset.index = `${index}-${subIndex}`;
			nodeEl.style.width = `${width}px`;
			nodeEl.style.top = `${top - scrollTop + (height - 1)}px`;
			nodeEl.style.left = `${left - scrollLeft}px`;

			this.underlineWrapEl.appendChild(nodeEl);
			subIndex += 1;
		});
	}
	removeUnderline(index) {
		const nodeEl = this.underlineWrapEl.querySelector(`span[data-index^="${index}"]`);
		if(nodeEl)
			nodeEl.remove();
	}
	resetUnderlines() {
		this.underlineWrapEl.innerHTML = ``;
	}
	setDotStatus({ status, error_count }) {
		if(error_count > 0) {
			delete this.dotEl.dataset.status;
			this.dotEl.dataset.error = `${error_count}`;
			this.errorCountEl.innerText = `${error_count}`;

			return;
		}

		if(status === `loading`) {
			this.dotEl.dataset.status = `loading`;
		} else {
			delete this.dotEl.dataset.status;
			delete this.dotEl.dataset.error;
		}

		switch(status) {
			case `loading`:
				this.dotEl.dataset.status = `loading`;
				break;

			case `error`:
				this.dotEl.dataset.status = `error`;
				delete this.dotEl.dataset.error;
				break;

			case `too-long`:
				this.dotEl.dataset.status = `too-long`;
				delete this.dotEl.dataset.error;
				break;

			default:
				delete this.dotEl.dataset.status;
				delete this.dotEl.dataset.error;
		}
	}
}

export default GrammarExtension;