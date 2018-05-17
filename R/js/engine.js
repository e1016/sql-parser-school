
var electron = require('electron').remote

// + - - - - - - - - - - - - - - - - - - +
// |   dev options, remove this later    |
// + - - - - - - - - - - - - - - - - - - +

function c (m) { console.log(m) }

// + - - - - - - - - - - - - - +
// |   import resources here   |
// + - - - - - - - - - - - - - +
const Imports = {
	javascript: [
		'syntax'
	],
	stylesheet: [
		'conf',
		'index',
		'syntax-blue'
	],
	// + - - - - - - - - - - - - - - - - - - - - - - +
	// |   executed after all resources are laded    |
	// + - - - - - - - - - - - - - - - - - - - - - - +
	beforeMouted(callback) {
		setTimeout(() => {
			callback()
			document.body.style.transition = 'opacity 0.3s ease';
			document.body.style.opacity = 1;
		}, 300)
	}
}

// + - - - - - - - - - - - - - - - - - - - - +
// |   creating and loading all resources    |
// + - - - - - - - - - - - - - - - - - - - - +

Imports.javascript.forEach ( script => {
	let scriptTag = document.createElement('script')
	scriptTag.setAttribute('src', './R/js/' + script + '.js')
	document.head.prepend ( scriptTag )
})

Imports.stylesheet.forEach ( stylesheet => {
	let stylesheetTag = document.createElement('link')
	stylesheetTag.setAttribute('rel', 'stylesheet')
	stylesheetTag.setAttribute('href', './R/css/' + stylesheet + '.css')
	document.head.prepend ( stylesheetTag )
})

// + - - - - - - - - - - - - - - - - - - +
// |                                     |
// |   $find definition for search       |
// |   and get DOM Elements faster.      |
// |                                     |
// |   $bind method defined for bind     |
// |   simultaneously many elements      |
// |   to the same event.                |
// |                                     |
// + - - - - - - - - - - - - - - - - - - +

function $find ( argument ) {
	let _tmp_DOM = document.querySelectorAll(argument);
	return ( _tmp_DOM.length > 1 )
	? _tmp_DOM
	: _tmp_DOM[0];
}

// + - - - - - - - - - - - - - - - - - - +
// |                                     |
// |   Define main process module        |
// |   for control and sync data         |
// |   initilized on ../../index.html    |
// |   referenced as MainProcess.run()   |
// |                                     |
// + - - - - - - - - - - - - - - - - - - +

var wait = setTimeout(function () {
	vm.status = 0
}, 10);

const MainProcess = {
	run () {
		this.cacheDOM();
		this.bindListeners();
	},
	// - - - - - - - - - - - - - - +
	//  starts of custom methods   |
	// - - - - - - - - - - - - - - +
	paintLines () {
		this.lines = this.$mirror.textContent.split('\n')
		let tmp = '<ul>'
		for(i = 1; i <= this.lines.length; i++) {
			tmp += `<li>${i}</li>`
		} tmp += '</ul>'

		this.$mirror.innerHTML = tmp + this.$mirror.innerHTML;
	},
	syncWithMirror (e) {
		this.$mirror.innerHTML = Compile.parseSyntx(e.target.value);
		vm.status = 1
		this.paintLines()
		clearTimeout(wait)
		wait = setTimeout(function () {

			tablaLexica = createGrammarTable(extractText());

			if (!tablaLexica.error) {
				if (checkSintax(tablaLexica)) {
					vm.status = 0;
				}
			} else{
				vm.status = 2;
			}

		}, 1000);
	},
	syncScrollMirror (e) {
		this.$mirror.scrollTop = e.target.scrollTop;
	},
	// - - - - - - - - - - - - - - +
	//  resize methods FIX LATER   |
	// - - - - - - - - - - - - - - +

	// addClassReziser () {
	// 	this.$mirror.classList.add('onReziseCodeArea');
	// 	this.$input.classList.add('onReziseConsole');
	// },
	// removeClassReziser () {
	// 	this.$mirror.ClassList.remove('onReziseCodeArea');
	// 	this.$input.ClassList.remove('onReziseConsole');
	// },
	// useClassReziser (e) {
	// 	c(e)
	// 	document.body.querySelector('.onReziseCodeArea').style.width = 'calc(100vw - ' + e.clientX + 'px)';
	// 	document.body.querySelector('.onReziseConsole')
	// },

	// - - - - - - - - - - - - - - +
	//  end of custom methods      |
	// - - - - - - - - - - - - - - +
	cacheDOM () {
		this.$input = $find('#input');
		this.$mirror = $find('#mirror');
		this.$septor = $find('#separator');
	},
	bindListeners () {
		this.$input.addEventListener(
			'input',
			this.syncWithMirror.bind(this)
		);
		this.$input.addEventListener(
			'scroll',
			this.syncScrollMirror.bind(this)
		);
		// this.$septor.addEventListener(
		// 	'mousedown',
		// 	this.addClassReziser.bind(this)
		// );
		// window.addEventListener(
		// 	'mouseup',
		// 	this.removeClassReziser.bind(this)
		// );
		// window.addEventListener(
		// 	'mousemove',
		// 	this.useClassReziser.bind(this)
		// );
	}
};
