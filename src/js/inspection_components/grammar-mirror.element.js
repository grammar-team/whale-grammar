import findStringInText from "./kmp.algorithm";

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

		this.measureTextPositions = this.measureTextPositions.bind(this);
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


	measureTextPositions(findList) {
		if(findList.length < 1) {
			return {
				positionList: [],
				missingIndexList: []
			};
		}

		let textIndex = 0;
		const { innerText } = this.mirrorEl;
		const range = document.createRange();
		const positionList = [];
		const missingIndexList = [];
		findList.forEach((text, index) => {
			const start = findStringInText(innerText, text, textIndex);
			const end = start + text.length;
			if(start === -1) {
				missingIndexList.push(index);
				return;
			}

			range.setStart(this.mirrorEl.firstChild, start);
			range.setEnd(this.mirrorEl.firstChild, end);
			const rectList = range.getClientRects();
			for(let i = 0; i < rectList.length; i++) {
				const { height, width, left, top } = rectList[i];
				positionList.push({ height, width, left, top });
			}

			textIndex = end;
		});

		return {
			positionList, missingIndexList
		}
	}
}

export default GrammarMirror;