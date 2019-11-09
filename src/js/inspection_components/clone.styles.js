const styleCloneAttributes = [
	`border`, `padding`, `font`, `direction`, `text-align`,
	`text-shadow`, `text-indent`, `letter-spacing`, `word-break`,
	`overflow-wrap`, `word-spacing`, `writing-mode`, `white-space`, `vertical-align`,
	`clear`, `position`, `top`, `left`, `background`, `overflow`, `color`
];

export function cloneElementStyles(targetEl, mirrorEl) {
	const computedStyles = window.getComputedStyle(targetEl);
	styleCloneAttributes.forEach(e => {
		const style = computedStyles.getPropertyValue(`${e}`);
		if(style.length > 0) {
			mirrorEl.setStyle(e, style);
		}
	});

	const { offsetHeight, offsetWidth } = targetEl;
	mirrorEl.setStyle(`height`, `${offsetHeight}px`);
	mirrorEl.setStyle(`width`, `${offsetWidth}px`);
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