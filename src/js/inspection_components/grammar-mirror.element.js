import indexOfWords from "./kmp.algorithm";
import getAllRangePositions, { findAllNewLines } from "./range.algorithm";

class GrammarMirror extends HTMLElement {
	constructor() {
		super();

		this.findList = [];
		this.attachShadow({
			mode: `open`,
			delegatesFocus: true
		});

		this.render = this.render.bind(this);
		this.reset = this.reset.bind(this);
		this.setStyle = this.setStyle.bind(this);
		this.setText = this.setText.bind(this);
		this.setHTML = this.setHTML.bind(this);

		this.measureTextPositions = this.measureTextPositions.bind(this);

		this.render();
	}
	render() {
		this.mirrorEl = document.createElement(`div`);
		this.mirrorEl.role = `whale-grammar-mirror`;

		this.shadowRoot.appendChild(this.mirrorEl);
	}

	reset() {
		this.findList = [];
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
	setHTML(html) {
		this.mirrorEl.innerHTML = `${html}`;
	}

	measureTextPositions(findList) {
		if(findList !== undefined)
			this.findList = findList;

		if(this.findList.length < 1) {
			return { positionList: [], missingIndexList: [] };
		}

		const { innerText } = this.mirrorEl
		const newLineList = findAllNewLines(innerText);
		const { findPositionList, missingIndexList } = indexOfWords(innerText, this.findList);
		const positionList = getAllRangePositions(this.mirrorEl, { newLineList, findPositionList });
		
		return { positionList, missingIndexList };
	}
}

export default GrammarMirror;