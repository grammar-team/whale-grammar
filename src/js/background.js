/* global whale */

import { fetchJsonp } from "./background_components/jsonp.functions";

const INSPECTION_LISTENER = {
	_filterErrorWords: (html) => {
		const nodeEl = document.createElement(`div`);
		nodeEl.innerHTML = `${html}`;

		const words = [];
		const wordEls = nodeEl.querySelectorAll(`span.result_underline`);
		wordEls.forEach(wordEl => {
			const { innerText } = wordEl;
			if(innerText)
				words.push(`${innerText}`);
		});

		return words;
	},
	inspectContent: function(port, options) {
		const { text } = options;
		const host = `https://m.search.naver.com/p/csearch/ocontent/util/SpellerProxy`;
		const where = `whale-grammar`;
		const url = `${host}?q=${text}&where=${where}&color_blindness=0`;

		fetchJsonp(url).then(data => {
			const { errata_count, origin_html } = data;
			const error_words = this._filterErrorWords(origin_html);
			port.postMessage({
				action: `inspectContentResult`,
				options: { error_count: errata_count, error_words }
			});
		});
	}
};

whale.runtime.onConnect.addListener(function(port) {
	if(port.name !== `grammar-inspection`)
		return;

	port.onMessage.addListener(function(message) {
		const { action, options } = message;
		if(
			INSPECTION_LISTENER.hasOwnProperty(action) &&
			typeof INSPECTION_LISTENER[action] === `function`
		)
			INSPECTION_LISTENER[action](port, options);
	});
});