<template>
  <div>
    <v-container grid-list-xl text-xs-center fluid>
      <v-jumbotron color="grey lighten-2" light >
        <v-container fill-height>
          <v-layout align-center>
            <v-flex>
              <h3 class="display-3">Welcome to GHPWA</h3>
              <span class="subheading">This GitHub client is a Progressive Web App.</span>
              <v-divider class="my-3"></v-divider>
              <div class="title mb-3" id="div-not-authenticated" v-if="!$store.getters.getAuthState"></div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-jumbotron>
    </v-container>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  // import router from '../router/index'
  import GitHub from 'github-api'
  import axios from 'axios'
  var qs = require('querystring')
  // var config = require('../../config')
  var xhr = require('xhr')
  export default {
    name: 'hello',
    data () {
      return {
        msg: '',
        inputUsername: '',
        inputPassword: '',
        code: '',
        client_id: process.env.client_id,
        redirect_uri: process.env.redirect_uri,
        gh: null
      }
    },
    computed: {
      ...mapGetters([
        'getAuthState'
      ])
    },
    methods: {
      ...mapActions([
        'setAuthState',
        'setToken'
      ]),
      getCode: function () {
        var query = window.location.href.split('?')[1]
        if (query) {
          window.history.replaceState({}, document.title, '/')
          return qs.parse(query.slice(0, query.length - 2)).code
        }
      },
      getToken: function (code, callback) {
        var options = {
          url: 'https://gatekeeper-pwa.herokuapp.com/authenticate/' + code,
          json: true
        }
        xhr(options, function (err, res, body) {
          if (err) {
            return callback(err)
          }
          callback(null, body.token)
        })
      },
      getProfile: function (token, callback) {
        var options = {
          url: 'https://api.github.com/user',
          json: true,
          headers: {
            authorization: 'token ' + token
          }
        }

        xhr(options, function (err, res, body) {
          if (err) return callback(err)
          callback(null, body)
        })
      },
      renderProfile: function (profile) {
        var p = document.createElement('p')
        p.innerHTML = profile.name
        document.body.appendChild(p)
      },
      authenticate: function () {
        var url = 'https://github.com/login/oauth/authorize?client_id=' + process.env.client_id + '&scope=user%20notifications%20gist%20repo%20public_repo%20delete_repo%20user:follow%20read:user%20write:discussion%20read:discussion&redirect_uri=' + process.env.redirect_uri
        var link = document.createElement('a')
        link.href = url
        link.innerHTML = 'Log in with GitHub'
        link.addEventListener('click', this.getCodeAndToken())
        document.getElementById('div-not-authenticated').appendChild(link)
      },
      getCodeAndToken: function () {
        var code = this.getCode()
        var component = this
        if (code) {
          component.getToken(code, function (err, token) {
            if (err) return err
            if (token) {
              component.$store.dispatch('setLoading', true)
              component.$store.dispatch('setAuthState')
              console.log('Setting token in storage...')
              localStorage.setItem('token', token)
              console.log('Setting token in store...')
              component.$store.dispatch('setToken', token).then(function () {
                axios.defaults.headers.common['Authorization'] = 'token ' + token
                axios.get('/user').then(function (response) {
                  component.$store.dispatch('setViewer', response.data)
                })
                console.log('All set, redirecting you to repos!')
                component.$router.push({ name: 'repos' })
              })
              component.gh = new GitHub({
                token: component.$store.getters.getToken
              })
            } else {
              // console.log('Invalid code')
            }
          })
        }
      }
    },
    mounted () {
      this.authenticate()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
  @import '../styles/variables.scss'

  h1, h2
    font-weight: normal

  ul
    list-style-type: none
    padding: 0

  li
    display: inline-block
    margin: 0 10px

  a
    color: $secondary

  #div-not-authenticated
    background-color: white
    padding: 2px 0 2px 0
    font-color: black
    font-weight: 900

</style>
