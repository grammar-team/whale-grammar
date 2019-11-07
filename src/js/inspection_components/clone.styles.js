const styleCloneAttributes = [
	`border`, `margin`, `padding`, `font`, `direction`, `textAlign`,
	`textShadow`, `textIndent`, `letterSpacing`, `wordBreak`,
	`overflowWrap`, `wordSpacing`, `writingMode`, `whiteSpace`, `verticalAlign`,
	`clear`, `boxSizing`, `width`, `height`, `position`, `top`, `left`,
	`background`, `overflow`, `color`
];

export function cloneElementStyles(targetEl, mirrorEl) {
	const computedStyles = window.getComputedStyle(targetEl);
	styleCloneAttributes.forEach(e => {
		const style = computedStyles.getPropertyValue(`${e}`);
		if(style.length > 0) {
			mirrorEl.setStyle(e, style);
		}
	});
}

function _cloneElementChildStyles(targetEl, mirrorEl) {
	const computedStyles = window.getComputedStyle(targetEl);
	styleCloneAttributes.forEach(e => {
		const style = computedStyles.getPropertyValue(`${e}`);
		if(style.length > 0) {
			mirrorEl.style[e] = style;
		}
	});
}

function nodeTreeTraverse(targetEl, mirrorEl) {
	if(!targetEl || !mirrorEl) {
		return;
	}

	_cloneElementChildStyles(targetEl, mirrorEl);
	nodeTreeTraverse(targetEl.firstElementChild, mirrorEl.firstElementChild);
	nodeTreeTraverse(targetEl.nextElementSibling, mirrorEl.nextElementSibling);
}
export function cloneChildElementStyles(targetEl, e) {
	const mirrorEl = e.getMirrorEl();
	nodeTreeTraverse(targetEl.firstElementChild, mirrorEl.firstElementChild);
}