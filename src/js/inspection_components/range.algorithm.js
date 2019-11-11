export function findAllNewLines(text) {
	let fromIndex = 0;
	const nList = [];
	while(true) {
		const index = text.indexOf(`\n`, fromIndex);
		if(index === -1) {
			return nList;
		}

		nList.push(index);
		fromIndex = index + 1;
	}
}

const TRAVERS = {
	findIndex: 0,
	offsetHead: 0,
	newlineIndex: 0,
	reset: function() {
		this.findIndex = 0;
		this.offsetHead = 0;
		this.newlineIndex = 0;
	},
	increaseIndex: function(findPositionList) {
		if(this.findIndex + 1 >= findPositionList.length)
			return false;

		this.findIndex += 1;
		return true;
	},
	increaseNewlineIndex: function() {
		this.newlineIndex += 1;
	},
	increaseHead: function(textLength) {
		this.offsetHead += textLength;
	}
};

const range = document.createRange();
function getRangeSelection(textNode, { start, end }) {
	range.setStart(textNode, start);
	range.setEnd(textNode, end);

	return range.getClientRects();
}
function nodeTreeTravers(parentEl, nodeEl, { newLineList, findPositionList }, positionList) {
	if(findPositionList[TRAVERS.findIndex] === undefined) {
		return;
	}

	let { start, end } = findPositionList[TRAVERS.findIndex];
	if(nodeEl === null || nodeEl === undefined) {
		return;
	}

	if(TRAVERS.offsetHead > end) {
		if(TRAVERS.increaseIndex(findPositionList)) {
			start = findPositionList[TRAVERS.findIndex].start;
			end = findPositionList[TRAVERS.findIndex].end;
		}
	}

	if(nodeEl.nodeType === Node.TEXT_NODE) {
		const { length } = nodeEl;
		const offsetStart = TRAVERS.offsetHead;
		const offsetEnd = offsetStart + length;

		while(true) {
			if(offsetStart < end && start < offsetEnd) {
				const s = Math.max(start - offsetStart, 0);
				const e = Math.min(end, offsetEnd) - offsetStart;

				const rectList = getRangeSelection(nodeEl, { start: s, end: e });
				for(let i = 0; i < rectList.length; i++) {
					const { height, width, left, top } = rectList[i];
					positionList.push({ height, width, top, left, index: TRAVERS.findIndex });
				}
			}
			if(end < offsetEnd && TRAVERS.increaseIndex(findPositionList)) {
				start = findPositionList[TRAVERS.findIndex].start;
				end = findPositionList[TRAVERS.findIndex].end;

				continue;
			}

			break;
		}

		TRAVERS.increaseHead(length);
		while(true) {
			if(newLineList[TRAVERS.newlineIndex] === TRAVERS.offsetHead) {
				TRAVERS.increaseHead(1);
				TRAVERS.increaseNewlineIndex(newLineList);

				continue;
			}

			break;
		}

	} else if(nodeEl.nodeType === Node.ELEMENT_NODE) {
		nodeTreeTravers(parentEl, nodeEl.firstChild, { newLineList, findPositionList }, positionList);
	}

	nodeTreeTravers(parentEl, nodeEl.nextSibling, { newLineList, findPositionList }, positionList);
}

export default function(mirrorEl, { newLineList, findPositionList }) {
	TRAVERS.reset();

	const positionList = [];
	nodeTreeTravers(mirrorEl, mirrorEl, { newLineList, findPositionList }, positionList);

	return positionList;
}