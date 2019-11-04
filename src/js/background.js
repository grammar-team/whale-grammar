/* global whale */

import { fetchJsonp } from "./background_components/jsonp.functions";

const PORT_LIST = [];
let EVENT_QUEUE = null;

const INSPECTION_LISTENER = {
<<<<<<< HEAD
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
=======
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
		const encodedText = window.encodeURIComponent(text);
		const host = `https://m.search.naver.com/p/csearch/ocontent/util/SpellerProxy`;
		const where = `whale-grammar`;
		const url = `${host}?q=${encodedText}&where=${where}&color_blindness=0`;

		port.postMessage({
			action: `startInspection`,
			options: {  }
		});
		fetchJsonp(url).then(data => {
			const { errata_count, origin_html } = data;
			const error_words = this._filterErrorWords(origin_html);
			port.postMessage({
				action: `inspectContentResult`,
				options: { error_count: errata_count, error_words }
			});
		});
	}
>>>>>>> cb411a7c816e206ae407cdbd5fcffc61956f341b
};

function onMessagePushQueue(message) {
    EVENT_QUEUE = message;
    whale.sidebarAction.show();
}

function SplitText(getText) {
    const sentences = getText.replace(/(\.|\:|\!|\?|\n)(\n|\r|\r\n)*(?=[\s가-힣0-9])/gm, "$1$2|").split("|");
    let textContainer = [];
    let textCat = "";
    let sum = 0;

    for(let i in sentences) {
        if(sum + sentences[i].length > 500) {
            textContainer.push(textCat);
            textCat = "";
            sum = 0;
        }
        textCat += sentences[i];
        sum += sentences[i].length;

        if(i == sentences.length-1) {
            textContainer.push(textCat);
        }
    }

    return textContainer;
}

whale.runtime.onConnect.addListener(function(port) {
    if(!port.name.includes(`grammar-sidebar-`))
        return;

    PORT_LIST.push(port);

    const onMessageCallback = function (message) {
        whale.sidebarAction.show();

        if(EVENT_QUEUE === null) {
            const {action, options} = message;
            const {text} = options;
            const segmentedText = SplitText(text);
            options.segmentedText = segmentedText;

            port.postMessage({action, options});
        }
    };

    whale.runtime.onMessage.removeListener(onMessagePushQueue);
    whale.runtime.onMessage.addListener(onMessageCallback);

    port.onDisconnect.addListener(() => {
        whale.runtime.onMessage.removeListener(onMessageCallback);

        for(let i = 0; i < PORT_LIST.length; i++) {
            if(PORT_LIST[i].name === port.name) {
                PORT_LIST.splice(i, 1);
            }
        }

        if(PORT_LIST.length < 1) {
            whale.runtime.onMessage.addListener(onMessagePushQueue);
        }
    });

    if(EVENT_QUEUE !== null) {
        const { action, options } = EVENT_QUEUE;
        const { text } = options;
        const segmentedText = SplitText(text);
        options.segmentedText = segmentedText;

        /*setTimeout(function() {
            port.postMessage({ action, options });
        }, 3000);
        */
        port.postMessage({ action, options });
        EVENT_QUEUE = null;
    }
});

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

whale.runtime.onMessage.addListener(onMessagePushQueue);