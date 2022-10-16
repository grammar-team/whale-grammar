/* global whale */

export function isSidebar() {
  const { dataset } = document.documentElement;
  const { userAgent } = window.navigator;
  const { href } = window.location;
  if (userAgent.includes(`sidebar`) && dataset.useragent.includes(`sidebar`) && href.includes(`whale-grammar`)) {
    return true;
  }

  return false;
}
export function isSidebarFrame() {
  const { userAgent } = window.navigator;
  const { href } = window.location;
  if (userAgent.includes(`sidebar`) && href.includes(`whale-grammar`)) {
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

function bindEventToNAVER() {
  const aEl = document.querySelector(`.service_logo`);
  aEl.target = `_blank`;
}

function renderCampaignSection() {
  const imgSrc = whale.runtime.getURL(`image/chrome-web-store.png`);
  const sectionEl = document.createElement(`section`);
  sectionEl.className = `sc extension-campaign`;
  sectionEl.innerHTML = `
		<a class="section-content" href="https://chrome.google.com/webstore/detail/alddllhhoalhongghdfhelgaabcnbfej" target="_blank">
			<h3>더 빠르게, 바로 교정하세요</h3>
			<p>신규 버전에서는 클릭 한 번에<br />올바른 맞춤법으로 교정할 수 있습니다.</p>
			<p style="font-size: 0;line-height: 0; margin: 18px 0 0 0">
				<span class="chrome-store">
					<img src="${imgSrc}" />
				</span>
			</p>
		</a>
	`;

  return sectionEl;
}

function renderExtensionSection() {
  const imgSrc = whale.runtime.getURL(`image/contest_logo.png`);
  const sectionEl = document.createElement(`section`);
  sectionEl.className = `sc extension-introduce`;
  sectionEl.innerHTML = `
		<div class="section-content">
			<a href="https://whale.naver.com/contest" target="_blank"><img src="${imgSrc}" alt="whale-contest" /></a>			
			<p class="title">웨일 확장앱 콘테스트 2019</p>
			<p class="description">본 확장앱은 웨일 확장앱 콘테스트 출품작입니다.</p>
		</div>
		<ul class="section-buttons">
			<li><a href="https://www.notion.so/3eb3c29fb8e54bb1bc62a370f676a8d3">사용방법</a></li>
			<li><a href="https://github.com/dlehdanakf/whale-grammar/issues">버그신고</a></li>
			<li><a href="https://store.whale.naver.com/detail/gmfkgfndfdfgbghjmmcpakibpbjpbfok">리뷰 남기기</a></li>
		</ul>
	`;

  return sectionEl;
}
function injectIntroduceSection(nodeEl) {
  const sectionEl = renderExtensionSection();
  const campaignEl = renderCampaignSection();

  const aEls = sectionEl.querySelectorAll(`a`);
  aEls.forEach((aEl) => {
    aEl.addEventListener(`click`, function (e) {
      e.preventDefault();
      whale.runtime.sendMessage({
        action: `openURL`,
        options: { url: this.href },
      });
    });
  });

  nodeEl.parentElement.insertBefore(sectionEl, nodeEl.nextSibling);
  nodeEl.parentElement.insertBefore(campaignEl, nodeEl);
}
function transformServiceLogo() {
  const imgEl = document.createElement(`img`);
  imgEl.src = whale.runtime.getURL(`image/naver_logo.png`);
  imgEl.alt = `NAVER`;
  imgEl.className = `whale-grammar-naver`;

  const headerEl = document.querySelector(`.api_title_area`);
  headerEl.appendChild(imgEl);

  const titleEl = headerEl.querySelector(`.api_title`);
  const { textContent } = titleEl.firstChild;
  titleEl.firstChild.textContent = textContent.replace(`네이버`, ``).trim();
}

export function transformDisplayComponents(sectionEl) {
  duplicateInspectButton(sectionEl);
  injectIntroduceSection(sectionEl);

  bindEventToNAVER();
  transformServiceLogo();
}

export function constructComponentController(sectionEl) {
  const inputEl = sectionEl.querySelector(`textarea`);
  const buttonEl = sectionEl.querySelector(`button.inspection`);
  const resultEl = sectionEl.querySelector(`.result_text`);
  const disableButtonEl = sectionEl.querySelector(`.inspection_bx`);
  const segmentedTextEl = sectionEl.querySelector(`.api_subject_bx`);
  const textNumEl = sectionEl.querySelector(`.txt_limit strong`);
  const grammarAreaEl = sectionEl.querySelector(`.grammar_area`);
  const resultBoxEl = sectionEl.querySelector(`.result_bx`);

  return {
    sectionEl,
    inputEl,
    buttonEl,
    resultEl,
    disableButtonEl,
    segmentedTextEl,
    textNumEl,
    grammarAreaEl,

    setText: function (e) {
      if (typeof e !== typeof `string` || e.length < 1) return;

      this.inputEl.value = `${e}`;
      this.inputEl.dispatchEvent(new Event(`input`));

      disableButtonEl.style.display = `block`;
      this.textNumEl.innerText = e.length;
      this.runInspection();
    },
    setTextMutation: function (e) {
      let timeout;
      const observer = new MutationObserver(() => {
        clearInterval(timeout);
        observer.disconnect();
      });

      observer.observe(resultBoxEl, {
        attributes: true,
        childList: true,
      });
      timeout = setInterval(() => this.setText(e), 100);
    },
    runInspection: function () {
      this.buttonEl.click();
    },
    getResult: function (e) {
      return this.resultEl.textContent.trim();
    },
  };
}
