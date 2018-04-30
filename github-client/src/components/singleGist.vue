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
      <span class="subheading text-sm-left text-xs-left mt-5">{{viewer.gist.name}}</span>
      <p class="caption text-sm-left text-xs-left">{{viewer.gist.createdAt | moment("from") }}</p>
      <p class="subheading text-sm-left text-xs-left">{{viewer.gist.description}}</p>
      <v-layout row wrap>
        <v-flex xs12>
          <ul>
            <li v-for="file in files">
              <v-card ripple tile append replace style="width: 75vh;" class="my-2">
                <v-card-title primary-title class="text-xs-left text-sm-left">
                  <div >
                    <p class="headline">{{file.filename}}</p>
                  </div>
                </v-card-title>
                <v-card-text class="text-xs-left text-sm-left">
                  <div>
                    <p class="body-1">{{file.content}}</p>
                  </div>
                </v-card-text>
              </v-card>
            </li>
          </ul>
        </v-flex>
      </v-layout>
    </v-container>
  </div>

</template>

<script>
  import gql from 'graphql-tag'

  export default {
    name: 'single-gist',
    data: () => ({
      name: 'singleGist',
      gistName: null,
      viewer: null,
      gist: null,
      files: null
    }),
    apollo: {
      viewer: {
        query: gql`
        query getGist($gist_name: String!){
            viewer{
              gist(name: $gist_name){
                name
                createdAt
                description
                stargazers{
                  totalCount
                }
              }
            }
          }
        `,
        variables () {
          return {
            gist_name: this.gistName
          }
        }
      }
    },
    mounted: function () {
      var _self = this
      this.gistName = this.$route.params.name
      this.gist = _self.gh.getGist(this.gistName)
      this.gist.read().then(function (data) {
        _self.files = data.data.files
      })
      console.log('name', this.$route.params.name)
    }
  }
</script>

<style scoped>

</style>
