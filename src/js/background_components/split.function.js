export default function(getText) {
	const sentences = getText.replace(/(\.|\:|\!|\?|\n)(\n|\r|\r\n)*(?=[\s가-힣0-9])/gm, "$1$2|").split("|");
	let textContainer = [];
	let textCat = "";
	let sum = 0;

	for(let i in sentences) {
		if(sum + sentences[i].length > 500) {
			textContainer.push(textCat);
			textCat = "";
			sum = 0;
		}
		textCat += sentences[i];
		sum += sentences[i].length;

		if(i == sentences.length-1) {
			textContainer.push(textCat);
		}
	}

	return textContainer;
}