/* global whale */
export function getAllBlackList() {
	return new Promise(resolve => {
		whale.storage.sync.get({ "blackList": [] }, e => {
			if(
				!e.hasOwnProperty(`blackList`) ||
				typeof e.blackList !== typeof []
			) {
				resolve([]);
			} else {
				const { blackList } = e;
				resolve(blackList);
			}
		});
	});
}

export function addURLtoBlacklist(hostname) {
	getAllBlackList().then(blackList => {
		blackList.push(hostname);
		whale.storage.sync.set({ "blackList": blackList });
	});
}
export function isURLinBlacklist(hostname) {
	return new Promise(resolve => {
		getAllBlackList().then(blackList => {
			resolve(blackList.includes(hostname));
		});
	});
}