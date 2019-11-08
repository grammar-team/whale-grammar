/* global whale */

import { fetchJson } from "./background_components/jsonp.functions";
import splitText from "./background_components/split.function";

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
		port.postMessage({
			action: `startInspection`,
			options: {  }
		});

		fetchJson(text).then(data => {
			const { status, errata_count, origin_html } = data;
			if(status !== 200) {
				port.postMessage({
					action: `inspectionError`,
					options: {  }
				});
			}

			const error_words = this._filterErrorWords(origin_html);
			port.postMessage({
				action: `inspectionResult`,
				options: { error_count: errata_count, error_words }
			});
		}).catch(data => {
			const { status } = data;
			port.postMessage({
				action: status === 0 ? `inspectionTooLong` : `inspectionError`,
				options: {  }
			});
		});
	}
};
const SIDEBAR_LISTENER = {
	portList: {},
	eventQueue: [],

	_broadcastMessage: function(message) {
		Object.keys(this.portList).forEach(v => {
			this.portList[v].postMessage(message);
		});
	},
	onMessageCallback: function(message) {
		const { action, options } = message;
		const { text } = options;
		if(text !== undefined) {
			options.segmentedText = splitText(text);
		}

		this._broadcastMessage({ action, options });
		whale.sidebarAction.show();
	},
	onMessagePushQueue: function(message) {
		const { action, options } = message;
		const { text } = options;
		if(text !== undefined) {
			options.segmentedText = splitText(text);
		}

		this.eventQueue.push({ action, options });
		whale.sidebarAction.show();
	},
	popAllMessages() {
		this.eventQueue.forEach(message => {
			this._broadcastMessage(message);
		});

		this.eventQueue = [];
	}
};
const CONTEXT_MENU = {
	menuProperty: {
		title: `선택된 텍스트 맞춤법 검사하기`,
		contexts: [ `selection` ],
	},

	createContextMenu: function() {
		this.removeAll(() => {
			whale.contextMenus.create({
				...this.menuProperty,
				onclick: function(info) {
					const { selectionText } = info;
					const message = {
						action: `setOriginalText`,
						options: {
							text: selectionText,
							segmentedText: splitText(selectionText)
						}
					};

					onMessagePushQueue(message);
				}
			});
		});
	},
	createContextMenuWithPort: function() {
		this.removeAll(() => {
			whale.contextMenus.create({
				...this.menuProperty,
				onclick: function(info) {
					const { selectionText } = info;
					const message = {
						action: `setOriginalText`,
						options: {
							text: selectionText,
							segmentedText: splitText(selectionText)
						}
					};

					SIDEBAR_LISTENER._broadcastMessage(message);
					whale.sidebarAction.show();
				}
			});
		});
	},
	removeAll: function(callback) {
		whale.contextMenus.removeAll(callback);
	}
};

const onMessagePushQueue = e => SIDEBAR_LISTENER.onMessagePushQueue(e);
const onMessageCallback = e => SIDEBAR_LISTENER.onMessageCallback(e);
whale.runtime.onConnect.addListener(function(port) {
	const { name } = port;
    if(!name.includes(`grammar-sidebar-`))
        return;

    SIDEBAR_LISTENER.portList[name] = port;
    if(Object.keys(SIDEBAR_LISTENER.portList).length === 1) {
		whale.runtime.onMessage.removeListener(onMessagePushQueue);
		whale.runtime.onMessage.addListener(onMessageCallback);
		CONTEXT_MENU.createContextMenuWithPort();
	}

    port.onDisconnect.addListener(() => {
        delete SIDEBAR_LISTENER.portList[name];

        if(Object.keys(SIDEBAR_LISTENER.portList).length < 1) {
			whale.runtime.onMessage.removeListener(onMessageCallback);
            whale.runtime.onMessage.addListener(onMessagePushQueue);
            CONTEXT_MENU.createContextMenu();
        }
    });

    SIDEBAR_LISTENER.popAllMessages();
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
CONTEXT_MENU.createContextMenu();