class GrammarExtension extends HTMLElement {
	constructor() {
		super();

		this.attachShadow({
			mode: `open`,
			delegatesFocus: true
		});

		this.render = this.render.bind(this);
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
			checkImg: whale.runtime.getURL(`image/check.svg`),
			powerOffImg: whale.runtime.getURL(`image/power.svg`),
			loadingImg: whale.runtime.getURL(`image/loading.svg`)
		};
	}
	render() {
		const { cssFile, checkImg, powerOffImg, loadingImg } = this._getFiles();

		this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="${cssFile}" />
			<div role="grammar-underline"></div>
			<div role="grammar-dot">
				<a href="#" class="status" id="grammar-open">
					<img src="${checkImg}" alt="check" />
					<img src="${loadingImg}" alt="loading" />
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
			whale.runtime.sendMessage({
				action: `setOriginalText`,
				options: {
					text: this.targetEl.value
				}
			});
		});

		const powerEl = this.shadowRoot.querySelector(`#grammar-off`);
		powerEl.addEventListener(`click`, e => {
			e.preventDefault();
		});
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
	addUnderlines(underlineList) {
		this.resetUnderlines();
		underlineList.forEach((rect, index) => {
			const { height, width, left, top } = rect;
			const nodeEl = document.createElement(`span`);

			nodeEl.dataset.index = `${index}`;
			nodeEl.style.width = `${width}px`;
			nodeEl.style.top = `${top + (height - 1)}px`;
			nodeEl.style.left = `${left}px`;

			this.underlineWrapEl.appendChild(nodeEl);
		});
	}
	removeUnderline(index) {
		const nodeEl = this.underlineWrapEl.querySelector(`span[data-index="${index}"]`);
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
	}
}

export default GrammarExtension;