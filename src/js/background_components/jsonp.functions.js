function getParameterJoin(url) {
	if(url.indexOf('?') >= 0) {
		return `&`;
	}

	return `?`;
}

export function jsonp(url, callback) {
	const num = Math.round(100000 * Math.random());
	const name = `jsonp_callback_${num}`;
	window[name] = function(data) {
		delete window[name];

		document.body.removeChild(script);
		callback(data);
	};

	const script = document.createElement('script');
	const join = getParameterJoin(url);
	script.src = `${url}${join}_callback=${name}`;

	document.body.appendChild(script);
}
export function fetchJsonp(url) {
	return new Promise(resolve => {
		jsonp(url, (data) => {
			const { message } = data;
			const { result } = message;
			resolve(result);
		});
	});
}