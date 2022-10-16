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
    const show_campaign = new Date().getTime();

    whale.storage.local.set({ show_campaign }, () => {
      window.close();
    });
  });
});
