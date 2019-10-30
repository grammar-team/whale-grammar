class GrammarExtension extends HTMLElement {
	constructor() {
		super();

		const c = this.attachShadow({
			mode: `open`,
			delegatesFocus: true
		});
	}
}

export default GrammarExtension;