function generateURL(text, callback_name) {
	const host = `https://m.search.naver.com/p/csearch/ocontent/util/SpellerProxy`;
	const where = `whale-grammar`;
	const encodedText = window.encodeURIComponent(text);

	return `${host}?q=${encodedText}&where=${where}&color_blindness=${0}&_callback=${callback_name}`;
}

export function fetch(text, onSuccess, onError) {
	const num = Math.round(100000 * Math.random());
	const name = `jsonp_callback_${num}`;
	window[name] = function(data) {
		delete window[name];

		document.body.removeChild(script);
		onSuccess(data);
	};

	const scriptSrc = generateURL(text, name);
	const script = document.createElement('script');
	script.src = `${scriptSrc}`;
	script.addEventListener(`error`, function() {
		delete window[name];

		document.body.removeChild(script);
		onError();
	});

	document.body.appendChild(script);
}
export function fetchJson(text) {
	return new Promise((resolve, reject) => {
		if(`${text}`.length > 500) {
			reject({ status: 0, message: `Too long text` });
			return;
		}

		fetch(text, (data) => {
			const { message } = data;
			const { result } = message;
			resolve({
				status: 200,
				message: `Success`,
				...result
			});
		}, () => {
			reject({ status: 500, message: `Network connection error` });
		});
	});
}