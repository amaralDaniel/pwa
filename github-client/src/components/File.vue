<template>
    <v-container class="text-sm-left">
      <v-flex row>
      <span class="display-1">{{file.name}}</span>
        <span>
          <button class="icon" v-on:click="editFile" v-if="viewerCanEdit">
          <i class="fas fa-pencil-alt"></i>
          </button>
        </span>
      </v-flex>
      <pre v-highlightjs="content"><code class="python"></code></pre>
    </v-container>

</template>

<script>
  import code from 'vue-highlightjs'
  export default {
    name: 'File',
    components: {
      code
    },
    data () {
      return {
        path: this.$route.params.path,
        repositoryOwner: this.$route.params.owner,
        repositoryName: this.$route.params.repo,
        file: null,
        content: '',
        viewerCanEdit: false
      }
    },
    mounted () {
      var _self = this
      let viewer = _self.$store.getters.getViewer
      _self.axiosInstance.get(`/repos/${_self.repositoryOwner}/${_self.repositoryName}/collaborators/${viewer.viewer.login}`).then(function (response) {
        if (response.status === 204) {
          _self.viewerCanEdit = true
        }
      })
      _self.axiosInstance.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/contents/' + _self.path).then(function (response) {
        _self.file = response.data
        // Going backwards: from bytestream, to percent-encoding, to original string.
        _self.content = decodeURIComponent(atob(response.data.content).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
      })
    },
    methods: {
      editFile: function () {
        this.$router.push({name: 'UpdateFile', params: {owner: this.repositoryOwner, name: this.repositoryName, path: this.path}})
      }
    }
  }
</script>

<style scoped>

  .fa-pencil-alt {
    font-size: 15pt;
    margin: 50% 50% 100% 100%;
  }

  code {
    color: black;
  }

  code, kbd {
    font-weight: normal;
  }

</style>
