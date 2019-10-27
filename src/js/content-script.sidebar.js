function isSidebar() {
	const { dataset } = document.documentElement;
	const { userAgent } = window.navigator;
	const { href } = window.location;
	if(
		userAgent.includes(`sidebar`) &&
		dataset.useragent.includes(`sidebar`) &&
		href.includes(`whale-grammar`)
	) {
		return true;
	}

	return false;
}
function duplicateInspectButton(parentEl) {
	const buttonEl = parentEl.querySelector(`button`);
	const { innerText, className } = buttonEl;

	const nodeEl = document.createElement(`span`);
	nodeEl.innerText = innerText;
	nodeEl.className = className;

	buttonEl.parentNode.insertBefore(nodeEl, buttonEl);
}

document.addEventListener(`DOMContentLoaded`, function() {
	if(isSidebar() === false) {
		return;
	}

	const bodyEl = document.querySelector(`body`);
	bodyEl.classList.add(`whale-grammar`);

	const sectionEl = document.querySelector(`#grammar_checker`);
	duplicateInspectButton(sectionEl);
});