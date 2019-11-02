class GrammarMirror extends HTMLElement {
	constructor() {
		super();

		this.attachShadow({
			mode: `open`,
			delegatesFocus: true
		});

		this.render = this.render.bind(this);
		this.reset = this.reset.bind(this);
		this.setStyle = this.setStyle.bind(this);
		this.setText = this.setText.bind(this);

		this.measureWordsPositions = this.measureWordsPositions.bind(this);

		this.render();
	}
	render() {
		this.mirrorEl = document.createElement(`div`);
		this.mirrorEl.role = `whale-grammar-mirror`;

		this.shadowRoot.appendChild(this.mirrorEl);
	}

	reset() {
		this.mirrorEl.style.cssText = null;
		this.mirrorEl.innerText = ``;
	}
	setStyle(key, value) {
		this.mirrorEl.style.setProperty(key, value);
	}
	setText(text) {
		if(typeof text !== typeof `String` || text.length < 1) {
			text = ``;
		}

		this.mirrorEl.innerText = `${text}`;
	}

	measureWordsPositions(findList) {
		if(findList.length < 1) {
			return [];
		}

		const wordList = this.mirrorEl.innerText.split(` `);
		const range = document.createRange();
		let index = 0,
			start = 0,
			end = 0;

		const positionList = [];
		wordList.forEach(word => {
			end = start + word.length;
			if(index >= findList.length) {
				return;
			}

			range.setStart(this.mirrorEl.firstChild, start);
			range.setEnd(this.mirrorEl.firstChild, end);
			if(word === findList[index]) {
				const rects = range.getClientRects();
				for(let i = 0; i < rects.length; i++) {
					const { height, width, left, top } = rects[i];
					positionList.push({ height, width, left, top });
				}

				index += 1;
			}

			start = end + 1;
		});

		return positionList;
	}
}

export default GrammarMirror;