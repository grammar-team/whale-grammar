export function renderExtensionElement() {
	const extensionEl = document.createElement(`grammar-extension`);
	return extensionEl;
}

export function findProperParent(nodeEl) {
	const position = window.getComputedStyle(nodeEl).getPropertyValue(`position`);
	if(
		[`absolute`, `relative`, `fixed`].includes(position) ||
		document.body === nodeEl
	) {
		return nodeEl;
	}

	return findProperParent(nodeEl.parentElement);
}

export function getElementMargin(targetEl) {
	const computedStyles = window.getComputedStyle(targetEl);
	const margin = computedStyles.getPropertyValue(`margin`).split(` `);
	console.log(margin);
	switch(margin.length) {
		case 0:
			return { marginTop: 0, marginLeft: 0 }
		case 1:
			const [ value ] = margin;
			return { marginTop: value, marginLeft: value };
		case 2:
		case 3:
		case 4:
			const [ marginTop, marginLeft ] = margin;
			return { marginTop, marginLeft };
	}
}