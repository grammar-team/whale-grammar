import { transformDisplayComponents, constructComponentController } from "./sidebar_components/ui.component";

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

document.addEventListener(`DOMContentLoaded`, function() {
	if(isSidebar() === false) {
		return;
	}

	const bodyEl = document.querySelector(`body`);
	bodyEl.classList.add(`whale-grammar`);

	const sectionEl = document.querySelector(`#grammar_checker`);
	const controller = constructComponentController(sectionEl);
	transformDisplayComponents(sectionEl);
});