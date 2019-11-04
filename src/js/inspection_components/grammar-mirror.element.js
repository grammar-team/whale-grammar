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

		console.log(`finish:measureTextPositions`, positionList);
		return { positionList, missingIndexList };
	}

	_getCalculatedRange(nodeEl, { start, end }) {
		let offsetStart = 0, offsetEnd = 0,
			textNode = nodeEl.firstChild;

		while(textNode) {
			if(textNode.nodeType !== Node.TEXT_NODE) {
				textNode = textNode.nextSibling;
				continue;
			}

			offsetStart = offsetEnd;
			offsetEnd += textNode.length;
			if(offsetStart <= start && offsetEnd >= end) {
				break;
			}

			textNode = textNode.nextSibling;
			offsetEnd += 1;
		}

		const positionList = [];
		if(!textNode) {
			return positionList;
		}

		const range = document.createRange();
		range.setStart(textNode, start - offsetStart);
		range.setEnd(textNode, end - offsetStart);

		const rectList = range.getClientRects();
		for(let i = 0; i < rectList.length; i++) {
			const { height, width, left, top } = rectList[i];
			positionList.push({ height, width, left, top });
		}

		return positionList;
	}
	_measureTextPositions(findList) {
		if(findList !== undefined)
			this.findList = findList;

		if(this.findList.length < 1) {
			return {
				positionList: [],
				missingIndexList: []
			};
		}

		let textIndex = 0;
		const positionList = [];
		const missingIndexList = [];
		this.findList.forEach((text, index) => {
			const start = findStringInText(this.mirrorEl.innerText, text, textIndex);
			const end = start + text.length;
			if(start === -1) {
				missingIndexList.push(index);
				return;
			}

			const rectList = this._getCalculatedRange(this.mirrorEl, { start, end });
			for(let i = 0; i < rectList.length; i++) {
				const { height, width, left, top } = rectList[i];
				positionList.push({ height, width, left, top, text, index: `${index}-${i}` });
			}

			textIndex = end;
		});

		return {
			positionList, missingIndexList
		};
	}
}

export default GrammarMirror;