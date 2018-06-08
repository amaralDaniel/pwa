<template>
  <div
    id="e3"
    style="max-width: 85vh; margin: auto;"
    class=" lighten-3"
  >

    <!--<v-container-->
      <!--fluid-->
      <!--style="min-height: 0; position: relative;"-->
      <!--grid-list-lg-->
    <!--&gt;-->
      <!--<v-layout row wrap>-->
        <!--<v-flex xs12>-->
          <!--<ul id="repos-list">-->
            <!--<li v-for="node in nodes">-->
              <!--<router-link :to="{name: 'knownRepo', params: { owner: repo.owner.login, name: repo.name }}">-->
                <!--<v-card ripple tile append replace xs2 class="my-2">-->
                  <!--<v-card-title primary-title class="text-xs-left" >-->
                    <!--<v-layout row>-->
                      <!--<v-flex xs12 sm12>-->
                        <!--<span class="headline text-sm-left grey&#45;&#45;text">{{repo.owner.login}}/</span>-->
                        <!--<span class="headline text-sm-left">{{repo.name}}</span>-->
                        <!--<p class="body-2 grey&#45;&#45;text text-sm-left mt-2">Created <span class="body-1">{{ repo.created_at | moment("from") }}</span></p>-->
                        <!--<p class="body-2 grey&#45;&#45;text text-sm-left">Last updated <span class="body-1">{{ repo.updated_at | moment("from") }}</span></p>-->
                        <!--<p class="body-2 grey&#45;&#45;text text-sm-left">Forks: <span class="body-1">{{repo.forks_count}}</span></p>-->
                        <!--<p class="body-2 grey&#45;&#45;text text-sm-left">Disk Usage: <span class="body-1">{{repo.size}} kb</span></p>-->
                        <!--&lt;!&ndash;<ul class="text-sm-left">&ndash;&gt;-->
                        <!--&lt;!&ndash;<li v-for="lang in repo.languages.nodes">&ndash;&gt;-->
                        <!--&lt;!&ndash;<div class="text-xs-center">&ndash;&gt;-->
                        <!--&lt;!&ndash;<v-chip v-bind:color="lang.color">{{lang.name}}</v-chip>&ndash;&gt;-->
                        <!--&lt;!&ndash;</div>&ndash;&gt;-->
                        <!--&lt;!&ndash;</li>&ndash;&gt;-->
                        <!--&lt;!&ndash;</ul>&ndash;&gt;-->
                      <!--</v-flex>-->
                    <!--</v-layout>-->
                  <!--</v-card-title>-->
                  <!--<v-card-text>-->
                    <!--<div>-->
                      <!--<p v-if="repo.description">{{repo.description}}</p>-->
                    <!--</div>-->
                  <!--</v-card-text>-->
                  <!--&lt;!&ndash;<v-card-actions>-->
                    <!--<v-btn flat>Fork</v-btn>-->
                    <!--&lt;!&ndash;<v-btn flat color="purple">Explore</v-btn>&ndash;&gt;-->
                    <!--<v-spacer></v-spacer>-->
                  <!--</v-card-actions>&ndash;&gt;-->
                <!--</v-card>-->
              <!--</router-link>-->
            <!--</li>-->
          <!--</ul>-->
        <!--</v-flex>-->
      <!--</v-layout>-->
    <!--</v-container>-->
    {{nodes}}
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  Vue.use(require('vue-moment'))
  export default {
    name: 'Feed',
    data () {
      return {
        nodes: []
      }
    },
    beforeMount () {
      var _self = this
      axios.get('/feeds').then(function (response) {
        _self.nodes = response.data
        axios.get('https://github.com/timeline').then(function (response) {
          console.log(response.data)
        })
      })
    }
  }
</script>

<style lang="sass" scoped>
  router-link
    text-decoration: none !important
</style>
