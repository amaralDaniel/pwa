<template>
    <v-container class="text-xs-left text-sm-left" v-if="commit">
      <v-alert type="error" class="alert custom-alert" :value="error">
        {{errorMessage}}
      </v-alert>
      <v-alert type="success" class="success custom-alert" :value="success">
        {{successMessage}}
      </v-alert>
      Commited by <span>{{commit.author.login}}</span> <span>{{commit.commit.committer.date | moment("from")}}</span>
      <p></p>
      <span style="color: green">+ {{commit.stats.additions}}</span> <span style="color: red">- {{commit.stats.deletions}}</span>
      <ul id="files-list">
        <li v-for="file in commitFiles" class="my-2">
          <router-link :to="{name: 'File', params:{ owner: repositoryOwner, repo: repositoryName, path: file.path}}">
            {{file.file.filename}}
          </router-link>
          <codemirror ref="myCm"
                      :value="file.content"
                      :options="cmOptions"
                      @ready="onCmReady"
                      @focus="onCmFocus"
                      @input="onCmCodeChange"
                      class="CodeMirror">
          </codemirror>
          <div id="outputHtml"></div>
        </li>
      </ul>
    </v-container>
</template>

<script>
  import Vue from 'vue'
  // language js
  import 'codemirror/mode/javascript/javascript.js'
  // theme css
  import 'codemirror/theme/base16-dark.css'
  // require component
  import { codemirror } from 'vue-codemirror'

  // require styles
  import 'codemirror/lib/codemirror.css'
  import axios from 'axios'

  Vue.use(require('vue-moment'))

  export default {
    name: 'Commit',
    components: {
      codemirror
    },
    data () {
      return {
        repositoryOwner: this.$route.params.owner,
        repositoryName: this.$route.params.repo,
        sha: this.$route.params.sha,
        commit: null,
        parents: [],
        commitFiles: [],
        error: false,
        errorMessage: '',
        success: false,
        successMessage: '',
        cmOptions: {
          tabSize: 4,
          mode: 'javascript',
          line: true,
          message: '',
          readOnly: true,
          // mode: 'text/html',
          lineNumbers: true,
          collapseIdentical: false,
          highlightDifferences: true
        }
      }
    },
    mounted () {
      var _self = this
      axios.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/commits/' + _self.sha).then(function (response) {
        _self.commit = response.data
        _self.commit.files.forEach(function (file) {
          axios.get(file.contents_url).then(function (response) {
            var content = decodeURIComponent(atob(response.data.content).split('').map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            }).join(''))
            _self.commitFiles.push({file: file, content: content, path: response.data.path})
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
    },
    computed: {
      codemirror () {
        return this.$refs.myCm.codemirror
      }
    },
    methods: {
      onCmReady (cm) {
        // console.log('the editor is readied!', cm)
      },
      onCmFocus (cm) {
        // console.log('the editor is focus!', cm)
      },
      onCmCodeChange (newCode) {
        // console.log('this is new code', newCode)
        this.code = newCode
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import '../styles/variables.scss'

  .custom-alert
    position: absolute
    top: 14%
    left: 50%
    right: 5%

  a
    color: $secondary
    text-decoration: none
</style>
