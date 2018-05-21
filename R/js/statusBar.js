
Vue.config.productionTip = false
Vue.config.silent = true
Vue.config.devtools = false

window.vm = new Vue ({
  el: '#right-side',
  data: {
    status: 0,
    table: []
  },
  methods: {
    getKeys (obj) {
      var keys = []
      for ( key in obj ) {
        keys.push(key)
      }
      return keys
    }
  }
})
