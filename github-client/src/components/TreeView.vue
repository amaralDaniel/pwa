<template>
    <v-container text-sm-left text-xs-left>
      <div v-if="path != ''">
        <v-btn v-on:click="goBack">
          <i class="material-icons">
            arrow_back_ios
          </i>
        </v-btn>
      </div>
      <ul>
        <li v-for="file in contents">
          <router-link :to="{name: 'File', params:{owner: repositoryOwner, repo: repositoryName, path: file.path}}" v-if="file.type=='file'">
            <v-icon>insert_drive_file</v-icon>
            <span class="subheading">{{file.name}}</span>
          </router-link>
          <div v-if="file.type=='dir'" v-on:click="updateFiles(file.name)" class="folder">
            <v-icon>folder</v-icon>
            <span class="subheading">{{file.name}}</span>
          </div>
          <!--<p><span v-html="file.content"></span></p>-->
        </li>
      </ul>
    </v-container>

</template>

<script>
  import axios from 'axios'
  export default {
    name: 'TreeView',
    data () {
      return {
        contents: [],
        repositoryOwner: this.$route.params.owner,
        repositoryName: this.$route.params.name,
        repo: null,
        path: ''
      }
    },
    mounted () {
      var _self = this
      _self.repo = _self.gh.getRepo(this.repositoryOwner, this.repositoryName)
      _self.renderFiles()
    },
    methods: {
      renderFiles: function () {
        var _self = this
        _self.contents = []
        axios.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/contents' + _self.path).then(function (response) {
          response.data.forEach(function (each) {
            _self.contents.push(each)
          })
        })
      },
      updateFiles: function (path) {
        var _self = this
        _self.path += '/' + path
        _self.renderFiles()
      },
      goBack: function () {
        var _self = this
        var separatedPath = _self.path.split('/')
        separatedPath.shift()
        separatedPath.pop()
        separatedPath = Array.prototype.join.call(separatedPath, '/')
        _self.path = separatedPath
        _self.renderFiles()
      }
    }
  }
</script>

<style lang="sass" scoped>
  .folder
    cursor: pointer
</style>
