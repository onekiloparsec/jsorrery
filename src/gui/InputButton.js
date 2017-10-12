import $ from 'jquery';

const FA = 'fa ';
const BTNS_CLASS = {
	share: FA + 'fa-share-alt',
	start: [FA + 'fa-play-circle', FA + 'fa-pause-circle'],
};

export default class InputButton {

	constructor(labelTx, id, onClick, key) {

		const classNames = BTNS_CLASS[id];
		const classOff = (classNames instanceof Array) ? classNames[0] : classNames;
		const classOn = (classNames instanceof Array) ? classNames[1] : undefined;

		const label = classOff ? '&nbsp;' : labelTx;
		let status = false;

		this.btn = $(`<button class="${classOff}" id="${id}">${label}</button>`);
		this.btn.on('click.jsorrery', (e) => {
			e.stopPropagation();
			onClick();
			status = !status;
			const targetClass = (status && classOn) || classOff;
			this.btn.attr('class', targetClass);
		});

		if (key) {
			const keyCode = key.toUpperCase().charCodeAt(0);
			$(window).on('keyup.jsorrery', (e) => {
				// console.log(e.keyCode, keyCode);
				// console.log(String.fromCharCode(e.keyCode), String.fromCharCode(keyCode));
				if (e.keyCode === keyCode) this.btn.trigger('click');
			});
		}

	}

	getWidget() {
		return this.btn;
	}

}
