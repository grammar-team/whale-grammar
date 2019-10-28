/* global whale */

export function duplicateInspectButton(parentEl) {
	const buttonEl = parentEl.querySelector(`button`);
	const { innerText, className } = buttonEl;

	const nodeEl = document.createElement(`span`);
	nodeEl.innerText = innerText;
	nodeEl.className = className;

	buttonEl.parentNode.insertBefore(nodeEl, buttonEl);
}

export function bindEventToNAVER() {
	const aEl = document.querySelector(`.service_logo`);
	aEl.target = `_blank`;
}

function renderExtensionSection() {
	const imgSrc = whale.runtime.getURL(`image/contest_logo.png`);
	const sectionEl = document.createElement(`section`);
	sectionEl.className = `sc extension-introduce`;
	sectionEl.innerHTML = `
		<div class="section-content">
			<img src="${imgSrc}" alt="whale-contest" />			
			<p class="title">웨일 확장앱 콘테스트 2019 출품작</p>
			<p class="description"></p>
		</div>
		<ul class="section-buttons">
			<li><a href="#">개발자</a></li>
			<li><a href="#">버그신고</a></li>
			<li><a href="#">리뷰 남기기</a></li>
		</ul>
	`;

	return sectionEl;
}
export function injectIntroduceSection(nodeEl) {
	const sectionEl = renderExtensionSection();
	nodeEl.parentElement.insertBefore(sectionEl, nodeEl.nextSibling);
}