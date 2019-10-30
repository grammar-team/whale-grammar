/* global whale */

import { fetchJsonp } from "./background_components/jsonp.functions";

const INSPECTION_LISTENER = {
	inspectContent: function(port, options) {
		const { text } = options;
		const host = `https://m.search.naver.com/p/csearch/ocontent/util/SpellerProxy`;
		const where = `whale-grammar`;
		const url = `${host}?q=${text}&where=${where}&color_blindness=0`;

		console.log(`A`);
		fetchJsonp(url).then(data => {
			console.log(`B`);
			console.log(data);
		});
	}
};

whale.runtime.onConnect.addListener(function(port) {
	console.log(`C`);
	if(port.name !== `grammar-inspection`)
		return;

	port.onMessage.addListener(function(message) {
		console.log(`D`);
		const { action, options } = message;
		if(
			INSPECTION_LISTENER.hasOwnProperty(action) &&
			typeof INSPECTION_LISTENER[action] === `function`
		)
			INSPECTION_LISTENER[action](port, options);
	});
});

console.log(`K`);

chrome.runtime.onConnect.addListener(function(port) {
	console.log(`DCDC`);
});