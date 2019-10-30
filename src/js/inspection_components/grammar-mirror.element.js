class GrammarMirror extends HTMLElement {
	constructor() {
		super();

		this.attachShadow({
			mode: `open`,
			delegatesFocus: true
		});

		this.render = this.render.bind(this);
		this.resetStyles = this.resetStyles.bind(this);
		this.setStyle = this.setStyle.bind(this);
		this.setText = this.setText.bind(this);

		this.render();
	}
	render() {
		this.mirrorEl = document.createElement(`div`);
		this.mirrorEl.role = `whale-grammar-mirror`;

		this.shadowRoot.appendChild(this.mirrorEl);
	}

	resetStyles() {
		this.mirrorEl.style.cssText = null;
	}
	setStyle(key, value) {
		this.mirrorEl.style.setProperty(key, value);
	}
	setText(text) {
		if(typeof text !== typeof `String` || text.length < 1) {
			text = ``;
		}

		this.mirrorEl.innerText = `${text}`;
	}
}

export default GrammarMirror;