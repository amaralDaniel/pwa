<template>
  <div
    id="e3"
    style="max-width: 85vh; margin: auto;"
    class=" lighten-3"
  >

    <v-container
      fluid
      style="min-height: 0; position: relative;"
      grid-list-lg
    >
      <v-layout row wrap>
        <v-flex xs12>
          <ul>
            <li v-for="repo in orderedRepos">
              <router-link :to="{name: 'knownRepo', params: { owner: repo.owner.login, name: repo.name }}">
                <v-card ripple tile append replace xs2 class="my-2">
                  <v-card-title primary-title class="text-xs-left" >
                    <v-layout row>
                      <v-flex xs12 sm12>
                        <span class="headline text-sm-left grey--text">{{repo.owner.login}}/</span>
                        <span class="headline text-sm-left">{{repo.name}}</span>
                        <p class="body-2 grey--text text-sm-left mt-2">Created <span class="body-1">{{ repo.created_at | moment("from") }}</span></p>
                        <p class="body-2 grey--text text-sm-left">Last updated <span class="body-1">{{ repo.updated_at | moment("from") }}</span></p>
                        <p class="body-2 grey--text text-sm-left">Forks: <span class="body-1">{{repo.forks_count}}</span></p>
                        <p class="body-2 grey--text text-sm-left">Disk Usage: <span class="body-1">{{repo.size}} kb</span></p>
                        <!--<ul class="text-sm-left">-->
                          <!--<li v-for="lang in repo.languages.nodes">-->
                            <!--<div class="text-xs-center">-->
                              <!--<v-chip v-bind:color="lang.color">{{lang.name}}</v-chip>-->
                            <!--</div>-->
                          <!--</li>-->
                        <!--</ul>-->
                      </v-flex>
                    </v-layout>
                  </v-card-title>
                  <v-card-text>
                    <div>
                      <p v-if="repo.description">{{repo.description}}</p>
                    </div>
                  </v-card-text>
                  <!--<v-card-actions>
                    <v-btn flat>Fork</v-btn>
                    &lt;!&ndash;<v-btn flat color="purple">Explore</v-btn>&ndash;&gt;
                    <v-spacer></v-spacer>
                  </v-card-actions>-->
                </v-card>
              </router-link>
            </li>
          </ul>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  Vue.use(require('vue-moment'))
  export default {
    name: 'repos',
    data () {
      return {
        viewer: null,
        repos: [],
        downloadSwitch: false
      }
    },
    beforeMount () {
      var _self = this
      axios.get('/user/repos', {
        params: {
          type: 'all',
          per_page: 100
        }
      }).then(function (response) {
        _self.repos = response.data
      })
    },
    mounted () {
      // var _self = this
      // _self.axiosInstance.get('/user').then(function (response) {
      //   _self.viewer = response.data
      //   _self.$store.dispatch('setViewer', {viewer: response.data})
      //   console.log('viewer was setted')
      // })
    },
    computed: {
      orderedRepos: function () {
        return this._.orderBy(this.repos, 'updated_at', 'desc')
      }
    }
  }
</script>

<style lang="sass" scoped>

  router-link
    text-decoration: none !important

</style>
