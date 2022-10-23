function sendGA4Event() {
  fetch(`https://www.google-analytics.com/mp/collect?measurement_id=G-ZWXHCSW4V1&api_secret=Wb3S2T2VS16YCORPU4vxPA`, {
    method: "POST",
    body: JSON.stringify({
      client_id: "html_template",
      events: [
        {
          name: "CLICK_EXTENSION_DOWNLOAD",
          params: {},
        },
      ],
    }),
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const chromeButtonEls = document.querySelectorAll(".store-button");
  const closeButtonEl = document.querySelector(".close-button");

  chromeButtonEls.forEach((chromeButtonEl) => {
    chromeButtonEl.addEventListener("click", () => {
      sendGA4Event();
    });
  });

  closeButtonEl.addEventListener("click", () => {
    const result = confirm(
      "업데이트를 안하시겠습니까?\n웨않되 v1 버전 지원이 곧 종료됩니다.\n업데이트 진행 시 웨일 브라우저에서 웨않되 v2 버전을 계속 이용하실 수 있습니다."
    );

    if (result === true) {
      const show_campaign = new Date().getTime();

      whale.storage.local.set({ show_campaign }, () => {
        window.close();
      });
    }
  });
});
