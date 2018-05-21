
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
    wait = setTimeout(() => {

      tablaLexica = createGrammarTable(extractText());

      if (!tablaLexica.error) {
        if (checkSintax(tablaLexica)) {
          vm.status = 0;

          fetch('http://localhost/server/index.php?query=' + this.$input.value.replace('\n', ' '))

          .then(response => {
            return response.json()
          })
          .then(resJson => {
            vm.table = resJson
          })
        }
      } else{
        vm.status = 2;
      }

    }, 1000);
  },
  syncScrollMirror (e) {
    this.$mirror.scrollTop = e.target.scrollTop;
  },

  onReziePanes () {

    window.addEventListener('mouseup', () => {
      window.onmousemove = null
    });


    window.onmousemove = event => {

      var isValid = (
        event.screenX > 300 &&
        event.screenX < ( window.innerWidth - 300 )
      )

      if ( isValid ) {
        this.$leftPane.style.width = `calc(100vw - ${window.innerWidth - event.screenX}px)`;
        this.$input.style.width = `calc(100vw - ${window.innerWidth - event.screenX}px)`;
        this.$mirror.style.width = `calc(100vw - ${window.innerWidth - event.screenX}px)`;
        this.$septor.style.left = `calc(100vw - ${window.innerWidth - event.screenX + 3}px)`;
        this.$rightPane.style.width = `${window.innerWidth - event.screenX}px`;
        this.$statusBar.style.width = `${window.innerWidth - event.screenX}px`;
      }
    };
  },

  // - - - - - - - - - - - - - - +
  //  end of custom methods      |
  // - - - - - - - - - - - - - - +
  cacheDOM () {
    this.$input = $find('#input');
    this.$mirror = $find('#mirror');
    this.$leftPane = $find('pre.left-side');

    this.$septor = $find('#separator');
    this.$rightPane = $find('.right-side');
    this.$statusBar = $find('.status-bar');
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
    this.$septor.addEventListener(
      'mousedown',
      this.onReziePanes.bind(this)
    )
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
