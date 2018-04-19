<template>
  <v-container grid-list-md class="jumbotron-container">
    <v-jumbotron color="grey lighten-2">
      <v-container fill-height>
        <v-layout align-center text-sm-left>
          <v-flex>
            <h3 class="display-3">404</h3>
            <span class="subheading">Page not found.</span>
            <v-divider class="my-3"></v-divider>
            <router-link :to="{name: 'repos'}"><v-btn large color="primary" class="mx-0">Get back to safety</v-btn></router-link>
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron>
  </v-container>
</template>

<script>
  export default {
    name: 'not-found',
    data () {
      return {
        name: 'Not Found 404'
      }
    }
  }
</script>

<style lang="sass" scoped>
  .jumbotron-container
    max-width: 100%
</style>
