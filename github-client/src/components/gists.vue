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
                <v-card ripple tile append replace xs2 class="my-2" >
                  <v-card-title primary-title class="text-xs-left text-sm-left">
                    <v-layout row>
                      <v-flex xs12 sm12>
                        <p class="body-1 text-sm-left">{{gist.id}}</p>
                        <p v-if="gist.public" class="public-tag text-sm-right">PUBLIC</p>
                        <p v-else class="private-tag text-sm-right">PRIVATE</p>
                        <p class="caption grey--text">Created <span class="body-1">{{ gist.created_at | moment("from") }}</span></p>
                        <p class="caption grey--text" v-if="gist.created_at != gist.updated_at">Last updated <span class="body-1">{{ gist.updated_at | moment("from") }}</span></p>
                        <p class="caption grey--text">Never updated</p>
                      </v-flex>
                    </v-layout>
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
    max-width: fit-content

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
    max-width: fit-content

</style>
