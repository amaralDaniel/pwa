// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
// index.js or main.js
import 'vuetify/dist/vuetify.min.css'
import GitHub from 'github-api'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import VueApollo from 'vue-apollo'
import colors from 'vuetify/es5/util/colors'
import VueHighlightJS from 'vue-highlightjs'
import VueLodash from 'vue-lodash'
import axios from 'axios'

Vue.config.productionTip = false
Vue.use(Vuetify, {
  theme: {
    primary: '#8AEA92',
    secondary: '#2c3e50',
    accent: '#8c9eff',
    error: colors.red.accent3
  }
})

const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: 'https://api.github.com/graphql'
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token')
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

// Create the apollo client
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true
})

// Install the vue plugin
Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vue.prototype.gh = new GitHub({ token: store.getters.getToken })

axios.defaults.baseURL = 'https://api.github.com'
axios.defaults.headers.common['Authorization'] = 'token ' + localStorage.getItem('token')

Vue.use(VueHighlightJS)

Vue.use(VueLodash)

// This works on all devices/browsers, and uses IndexedDBShim as a final fallback
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB

if (!window.indexedDB) {
  window.alert("Your browser doesn't support a stable version of IndexedDB. Repository saving feature will not be available.")
}
const idb = indexedDB.open('saved-repos', 1)
idb.onerror = function (event) {
  alert('Something went wrong when creating an IndexedDB.')
}

idb.onupgradeneeded = function () {
  var db = idb.result
  var store = db.createObjectStore('saved-repos', {keyPath: 'url'})
  store.createIndex('url', 'url')
}

// idb.onsuccess = function () {
//   console.log('onsuccess')
//   // new tx
//   var db = idb.result
//   var tx = db.transaction('saved-repos', 'readwrite')
//   var store = tx.objectStore('saved-repos')
//   store.index('url')
//   console.log('new transaction')
//
//   store.put({url: 'repos/amaralDaniel/pwa', content: null})
//
//   tx.oncomplete = function () {
//     console.log('completed')
//     db.close()
//   }
// }

new Vue({ // eslint-disable-line no-new
  el: '#app',
  router,
  store,
  idb,
  provide: apolloProvider.provide(),
  template: '<App/>',
  components: { App }
})

router.beforeEach((to, from, next) => {
  const authRequired = to.matched.some((route) => route.meta.auth)
  const authed = store.getters.getAuthState
  if (authRequired && !authed) {
    next('/')
  } else {
    next()
  }
})
