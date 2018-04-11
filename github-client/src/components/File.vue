<template>
    <v-container class="text-sm-left">
      <span class="display-1">{{file.name}}</span>
      <pre v-highlightjs="content"><code class="python"></code></pre>
    </v-container>

</template>

<script>
  export default {
    name: 'File',
    data () {
      return {
        path: this.$route.params.path,
        repositoryOwner: this.$route.params.owner,
        repositoryName: this.$route.params.repo,
        file: null,
        content: ''
      }
    },
    mounted () {
      var _self = this
      _self.axiosInstance.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/contents/' + _self.path).then(function (response) {
        _self.file = response.data
        // Going backwards: from bytestream, to percent-encoding, to original string.
        _self.content = decodeURIComponent(atob(response.data.content).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
      })
    }
  }
</script>

<style scoped>

</style>
