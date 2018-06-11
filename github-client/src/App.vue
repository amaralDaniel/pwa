<template>
  <v-app id="app">
    <div v-if="loading" class="loader-spinner">
      <square-grid background="#8AEA92"></square-grid>
    </div>
    <v-navigation-drawer
      temporary
      v-model="drawer"
      :mini-variant="mini"
      light
      absolute
      color="primary"
    >
      <v-list class="pa-1">
        <v-list-tile v-if="mini" @click.stop="mini = !mini">
          <v-list-tile-action>
            <v-icon>chevron_right</v-icon>
          </v-list-tile-action>
        </v-list-tile>
        <v-list-tile avatar tag="div" v-if="viewer">
          <router-link :to="{name: 'User', params: { login: viewer.login}}" id="profile-drawer-button">
            <v-layout row align-center>
              <v-list-tile-avatar size="50" >
                <img :src="viewer.avatar_url" >
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{viewer.name}}</v-list-tile-title>
              </v-list-tile-content>
            </v-layout>
          </router-link>
          <v-list-tile-action align>
            <v-btn icon @click.stop="mini = !mini">
              <v-icon>chevron_left</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-list class="pt-0" dense>
        <v-divider light></v-divider>
        <v-list-tile v-for="item in items" :key="item.title" append replace :to="item.route">
          <v-list-tile-action >
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-list class="pt-0" dense>
        <v-divider light></v-divider>
        <v-list-tile v-for="item in actions" :key="item.title" append replace :to="item.route">
          <v-list-tile-action >
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-list class="pt-0" dense>
        <v-divider light></v-divider>
        <v-list-tile v-for="item in storageManagement" :key="item.title" append replace :to="item.route">
          <v-list-tile-action >
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider dark></v-divider>
      <v-list class="pt-0" dense >
        <v-list-tile v-if="$store.getters.getAuthState && !mini" v-on:click="logout" id="logout-button">
          <v-list-tile-action>
            <v-icon>
              exit_to_app
            </v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="$store.getters.getAuthState && mini">
          <v-list-tile-action>
            <v-btn flat v-on:click="logout" color="secondary" class="white--text">
              <v-icon>
                exit_to_app
              </v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark color="primary" extended >
      <v-toolbar-side-icon @click.native.stop="drawer = !drawer" dark v-if="$store.getters.getAuthState" id="toolbar-side-icon">
      </v-toolbar-side-icon>
      <router-link :to="{name: 'CreateRepo'}" v-if="$store.getters.getAuthState">
        <v-btn
          color="pink"
          small
          absolute
          bottom
          right
          fab
          class="mr-5"
        >
          <v-icon>add</v-icon>
        </v-btn>
      </router-link>
      <v-toolbar-title class="white--text title-gh">GitHub Client</v-toolbar-title>
      <v-spacer></v-spacer>
      <!--<v-container >-->
        <router-link :to="{name: 'Search'}" class="search-container" v-if="$store.getters.getAuthState" >
          <v-btn icon id="search-button">
            <v-icon>search</v-icon>
          </v-btn>
        </router-link>
      <!--</v-container>-->
    </v-toolbar>
    <main>
      <transition>
        <keep-alive>
          <router-view :key="$route.fullPath"></router-view>
        </keep-alive>
      </transition>
    </main>
    <v-card height="100px" flat v-if="$store.getters.getAuthState" style="background-color: transparent"  >
      <v-bottom-nav absolute :value="true" :active.sync="activeNav" color="white" class="footer--fixed" >
        <v-btn flat color="blue-grey" value="feed" append replace to="/notifications">
          <span>Notifications</span>
          <v-icon>notification_important</v-icon>
        </v-btn>
        <v-btn flat color="blue-grey" value="feed" append replace to="/feed">
          <span>Feed</span>
          <v-icon>timeline</v-icon>
        </v-btn>
        <v-btn flat color="blue-grey" value="repositories" append replace to="/repos">
          <span>Repositories</span>
          <v-icon>code</v-icon>
        </v-btn>
        <v-btn flat color="blue-grey" value="issues" append replace to="/issues">
          <span>Issues</span>
          <v-icon>info</v-icon>
        </v-btn>
        <v-btn flat color="blue-grey" value="gists" append replace to="/gists">
          <span>Gists</span>
          <v-icon>description</v-icon>
        </v-btn>
      </v-bottom-nav>
    </v-card>
  </v-app>
</template>

<script>
  import Vue from 'vue'
  import store from './store'
  import {SquareGrid} from 'vue-loading-spinner'
  Vue.use(require('vue-moment'))
  export default {
    components: {
      SquareGrid
    },
    name: 'app',
    data: () => ({
      activeNav: store.getters.getActiveNav,
      drawer: null,
      items: [
        { title: 'Notifications', icon: 'notification_important', route: '/notifications' },
        { title: 'Feed', icon: 'timeline', route: '/feed' },
        { title: 'Repositories', icon: 'code', route: '/repos' },
        { title: 'Issues', icon: 'info', route: '/issues' },
        { title: 'Gists', icon: 'description', route: '/gists' },
        { title: 'Search', icon: 'search', route: '/search' }
      ],
      actions: [
        { title: 'Create Repository', icon: 'add', route: '/create' }
      ],
      storageManagement: [
        { title: 'Storage Management', icon: 'storage', route: '/storage' }
      ],
      mini: false,
      right: null
    }),
    methods: {
      logout: function () {
        this.$store.dispatch('resetState')
        this.$router.push('/')
      }
    },
    computed: {
      viewer: function () {
        return this.$store.getters.getViewer
      },
      loading: function () {
        return this.$store.getters.getLoading
      }
    }
  }
</script>

<style lang="sass">
  @import './styles/variables.scss'
  body
    margin: 0

  #app
    font-family: 'Avenir', Helvetica, Arial, sans-serif
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale
    color: #2c3e50
    margin: 0

  main
    text-align: center

  header
    margin: 0
    height: 56px
    padding: 0 16px 0 24px
    background-color: #8AEA92
    color: #2c3e50

  header span
    display: block
    position: relative
    font-size: 20px
    line-height: 1
    letter-spacing: .02em
    font-weight: 400
    box-sizing: border-box
    padding-top: 16px

  ul
    list-style-type: none

  a
    color: inherit
    text-decoration: none

  .title-gh
    font-weight: 700

  .loader-spinner
    z-index: 999
    width: 100%
    height: 100%
    position: absolute
    background-color: white
    display: flex
    flex-direction: row
    flex-wrap: nowrap
    justify-content: center
    align-items: center
    align-content: stretch
</style>
