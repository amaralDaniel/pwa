<template>
    <v-container>
      Commited by <span>{{commit.author.login}}</span> <span>{{commit.commit.committer.date | moment("from")}}</span>
      <p></p>
      <span style="color: green">+ {{commit.stats.additions}}</span> <span style="color: red">- {{commit.stats.deletions}}</span>
    </v-container>

</template>

<script>
  import Vue from 'vue'
  Vue.use(require('vue-moment'))

  export default {
    name: 'Commit',
    data () {
      return {
        repositoryOwner: this.$route.params.owner,
        repositoryName: this.$route.params.repo,
        sha: this.$route.params.sha,
        commit: null,
        outputHtml: ''
      }
    },
    mounted () {
      var _self = this
      _self.axiosInstance.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/commits/' + _self.sha).then(function (response) {
        _self.commit = response.data
      })
    }
  }
</script>

<style scoped>

</style>
