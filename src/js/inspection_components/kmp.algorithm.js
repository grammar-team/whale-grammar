function _buildPatternTable(word) {
	const patternTable = [ 0 ];
	let prefixIndex = 0;
	let suffixIndex = 1;

	while (suffixIndex < word.length) {
		if (word[prefixIndex] === word[suffixIndex]) {
			patternTable[suffixIndex] = prefixIndex + 1;
			suffixIndex += 1;
			prefixIndex += 1;

		} else if (prefixIndex === 0) {
			patternTable[suffixIndex] = 0;
			suffixIndex += 1;

		} else {
			prefixIndex = patternTable[prefixIndex - 1];
		}
	}

	return patternTable;
}

export function indexOfWord(text, word, textIndex) {
	if(word.length === 0) {
		return 0;
	}

	const patternTable = _buildPatternTable(word);
	let wordIndex = 0;

	while(textIndex < text.length) {
		if(text[textIndex] === word[wordIndex]) {
			if(wordIndex === word.length - 1) {
				return (textIndex - word.length) + 1;
			}

			wordIndex += 1;
			textIndex += 1;
		} else if(wordIndex > 0) {
			wordIndex = patternTable[wordIndex - 1];
		} else {
			wordIndex = 0;
			textIndex += 1;
		}
	}

	return -1;
}
export default function(text, wordList) {
	const findPositionList = [];
	const missingIndexList = [];

	let textIndex = 0;
	wordList.forEach((word, index) => {
		const start = indexOfWord(text, word, textIndex);
		if(start === -1) {
			missingIndexList.push(index);
			return;
		}

		const end = start + word.length;
		findPositionList.push({ start, end, index });
		textIndex = end;
	});

	return {
		findPositionList,
		missingIndexList
	};
}