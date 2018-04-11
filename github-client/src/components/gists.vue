<template>
  <div
    id="e3"
    style="max-width: 85vh; margin: auto;"
    class=" lighten-3"
  >
    <v-container
      fluid
      style="min-height: 0;"
      grid-list-lg
    >
      <v-layout row wrap>
        <v-flex xs12>
          <ul>
            <li v-for="gist in gists">
              <router-link :to="{name: 'singleGist', params: {name: gist.id}}">
                <v-card ripple tile append replace class="my-2" >
                  <v-card-title primary-title>
                    <div >
                      <span class="headline text-sm-left">{{gist.id}}</span>
                      <span v-if="gist.public" class="public-tag text-sm-right">PUBLIC</span>
                      <span v-else class="private-tag text-sm-right">PRIVATE</span>
                    </div>
                  </v-card-title>
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
  Vue.use(require('vue-moment'))
  export default {
    name: 'gists',
    data () {
      return {
        name: 'gists',
        gists: []
      }
    },
    mounted () {
      var _self = this
      _self.axiosInstance.get('/gists').then(function (response) {
        response.data.forEach(function (each) {
          _self.gists.push(each)
        })
      })
    }
  }
</script>

<style lang="sass" scoped>
  @import '../styles/variables.scss'

  .private-tag
    border-style: solid
    border-width: 1px
    border-color: lightgrey
    padding: 2px 3px
    background-color: $secondary
    font-weight: bold
    color: white
    -webkit-border-radius: 1px
    -moz-border-radius: 1px
    border-radius: 1px

  .public-tag
    border-style: solid
    border-width: 1px
    border-color: lightgrey
    padding: 2px 3px
    background-color: $primary
    font-weight: bold
    color: white
    -webkit-border-radius: 1px
    -moz-border-radius: 1px
    border-radius: 1px

</style>
