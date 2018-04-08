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
      <span class="title text-sm-left">{{viewer.gist.name}}</span>
      <span class="caption text-sm-left">{{viewer.gist.createdAt | moment("from") }}</span>
      <p class="subheading text-sm-left">{{viewer.gist.description}}</p>
      <v-layout row wrap>
        <v-flex xs12>
          <ul>
            <li v-for="file in files">

                <v-card ripple tile append replace style="width: 75vh;" class="my-2">
                  <v-card-title primary-title>
                    <div >
                      <p class="headline text-sm-left">{{file.filename}}</p>
                      <!--<ul class="text-sm-left">-->
                      <!--<li v-for="lang in repo.languages.nodes">-->
                      <!--<div class="text-xs-center">-->
                      <!--<v-chip v-bind:color="lang.color">{{lang.name}}</v-chip>-->
                      <!--</div>-->
                      <!--</li>-->
                      <!--</ul>-->
                    </div>
                  </v-card-title>
                  <v-card-text>
                    <div>
                      <p class="body-1 text-sm-left">{{file.content}}</p>
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
