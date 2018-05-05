<template>
    <v-container>
      <v-alert type="error" class="alert custom-alert" :value="error">
        {{errorMessage}}
      </v-alert>
      <v-alert type="success custom-alert" :value="success">
        {{successMessage}}
      </v-alert>
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
        parents: [],
        commitFiles: [],
        parentFiles: [],
        outputHtml: '',
        error: false,
        errorMessage: '',
        success: false,
        successMessage: ''
      }
    },
    mounted () {
      var _self = this
      _self.axiosInstance.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/commits/' + _self.sha).then(function (response) {
        _self.commit = response.data
        _self.commit.files.forEach(function (file) {
          _self.commitFiles.push(file)
        })
        _self.commit.parents.forEach(function (parent) {
          _self.axiosInstance.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/commits/' + parent.sha).then(function (response) {
            _self.parents.push(response.data)
          })
        })
      }).catch(function (error) {
        _self.errorMessage = 'Something went wrong, please refresh.'
        _self.error = true
        setTimeout(function () {
          _self.error = false
        }, 5000)
        throw error
      })
    }
  }
</script>

<style scoped>
  .custom-alert {
    position: absolute;
    top: 14%;
    left: 50%;
    right: 5%;
  }
</style>
