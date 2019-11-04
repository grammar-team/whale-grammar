let FIND_INDEX = 0;
const range = document.createRange();
function getRangeSelection(textNode, { start, end }) {
	range.setStart(textNode, start);
	range.setEnd(textNode, end);

	return range.getClientRects();
}

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
	reset: function() {
		this.findIndex = 0;
		this.offsetHead = 0;
	},
	increaseIndex: function(findPositionList) {
		if(this.findIndex + 1 >= findPositionList.length)
			return false;

		this.findIndex += 1;
		return true;
	},
	increaseHead: function(textLength) {
		this.offsetHead += textLength;
	}
};
function nodeTreeTravers(nodeEl, { newLineList, findPositionList }, positionList) {
	let { start, end } = findPositionList[TRAVERS.findIndex];
	if(nodeEl === null || nodeEl === undefined) {
		console.log(`NULL`);
		return;
	}

	if(TRAVERS.offsetHead > start) {
		if(TRAVERS.increaseIndex(findPositionList)) {
			start = findPositionList[FIND_INDEX].start;
			end = findPositionList[FIND_INDEX].end;
		} else {
			console.log(`OVERFLOW`);
			return;
		}
	}

	if(nodeEl.nodeType === Node.TEXT_NODE) {
		const { length } = nodeEl;
		const offsetStart = TRAVERS.offsetHead;
		const offsetEnd = offsetStart + length;
		console.log(`check`, { start, end, offsetStart, offsetEnd });
		console.log({
			'start <= offsetStart': start <= offsetStart,
			'offsetEnd <= end': offsetEnd <= end
		});

		if(!(offsetEnd < start || offsetStart > end)) {
			const s = start - offsetStart;
			const e = Math.min(end, offsetEnd) - offsetStart;

			console.log(`push!`, { s, e, start, end, offsetStart, offsetEnd });
			const rectList = getRangeSelection(nodeEl, { start: s, end: e });
			for(let i = 0; i < rectList.length; i++) {
				const { height, width, left, top } = rectList[i];
				positionList.push({ height, width, left, top, index: `${FIND_INDEX}-${i}` });
			}
		}

		TRAVERS.increaseHead(length);
		if(newLineList.includes(offsetEnd)) {
			console.log(`newLine`, offsetEnd, newLineList);
			TRAVERS.increaseHead(1);
		}

	} else if(nodeEl.nodeType === Node.ELEMENT_NODE) {
		nodeTreeTravers(nodeEl.firstChild, { newLineList, findPositionList }, positionList);
	}

	nodeTreeTravers(nodeEl.nextSibling, { newLineList, findPositionList }, positionList);
}

export default function(mirrorEl, { newLineList, findPositionList }) {
	TRAVERS.reset();

	console.log(`run:`, findPositionList);
	const positionList = [];
	nodeTreeTravers(mirrorEl, { newLineList, findPositionList }, positionList);

	return positionList;
}