export function renderExtensionElement() {
	const extensionEl = document.createElement(`grammar-extension`);
	return extensionEl;
}

export function findProperParent(nodeEl) {
	if([`TD`, `TH`].includes(nodeEl.nodeName)) {
		nodeEl.style.position = `relative`;
		return nodeEl;
	}

	const position = window.getComputedStyle(nodeEl).getPropertyValue(`position`);
	if(
		[`absolute`, `relative`, `fixed`].includes(position) ||
		document.body === nodeEl
	) {
		return nodeEl;
	}

	return findProperParent(nodeEl.parentElement);
}