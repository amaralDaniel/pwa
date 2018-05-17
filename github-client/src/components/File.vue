<template>
  <v-container class="text-sm-left">
    <v-flex row>
    <span class="display-1">{{file.name}}</span>
      <span>
        <button class="icon" v-on:click="editFile" v-if="viewerCanEdit">
        <i class="material-icons">
          edit
        </i>
        </button>
      </span>
    </v-flex>
    <v-flex xs12 text-sm-left text-xs-left>
      <!-- bidirectional data binding（双向数据绑定） -->
      <!-- or to manually control the datasynchronization（或者手动控制数据流，需要像这样手动监听changed事件） -->
      <codemirror ref="myCm"
                  :value="content"
                  :options="cmOptions"
                  @ready="onCmReady"
                  @focus="onCmFocus"
                  @input="onCmCodeChange"
                  class="CodeMirror">
      </codemirror>
    </v-flex>
    <div id="outputHtml"></div>
  </v-container>
</template>

<script>
  // language js
  import 'codemirror/mode/javascript/javascript.js'
  // theme css
  import 'codemirror/theme/base16-dark.css'
  // require component
  import { codemirror } from 'vue-codemirror'

  // require styles
  import 'codemirror/lib/codemirror.css'
  var Diff2html = require('diff2html').Diff2Html
  export default {
    name: 'File',
    components: {
      codemirror
    },
    data () {
      return {
        path: this.$route.params.path,
        repositoryOwner: this.$route.params.owner,
        repositoryName: this.$route.params.repo,
        file: null,
        content: '',
        viewerCanEdit: false,
        cmOptions: {
          tabSize: 4,
          mode: 'javascript',
          lineNumbers: true,
          line: true,
          message: '',
          readOnly: true
        },
        test: '"@@ -2,3 +2,4 @@ node_modules\\n .DS_Store\\n docs/_book\\n config.js\\n+hello\\n\\\\ No newline at end of file"'
      }
    },
    mounted () {
      var _self = this
      let viewer = _self.$store.getters.getViewer
      _self.axiosInstance.get(`/repos/${_self.repositoryOwner}/${_self.repositoryName}/collaborators/${viewer.login}`).then(function (response) {
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
      let diff2htmlUi = new Diff2html({
        diff: _self.test
      })
      diff2htmlUi.draw('#outputHtml', { inputFormat: 'json', showFiles: true, matching: 'lines', outputFormat: 'side-by-side' })
    },
    computed: {
      codemirror () {
        return this.$refs.myCm.codemirror
      }
    },
    methods: {
      editFile: function () {
        this.$router.push({name: 'UpdateFile', params: {owner: this.repositoryOwner, name: this.repositoryName, path: this.path}})
      },
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

<style scoped>

  .material-icons {
    font-size: 15pt;
    margin: 50% 50% 100% 100%;
  }

  code {
    color: black;
  }

  code, kbd {
    font-weight: normal;
  }

  .CodeMirror {
    border: 1px solid #eee;
    height: auto;
  }


</style>
