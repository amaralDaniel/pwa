<template>
    <v-container>
      <v-layout row wrap>
        <v-flex xs4>
          <v-subheader class="subheading">Head</v-subheader>
        </v-flex>
        <v-flex xs12 sm6>
          <v-select
            :items="branches"
            v-model="selectedHead"
            label="Head"
            single-line
            color="secondary"
            required
            autocomplete
            :rules="[() => !!selectedHead || 'This field is required']"
          ></v-select>
        </v-flex>
      </v-layout>
      <v-flex xs12 text-sm-left>
        <!-- bidirectional data binding（双向数据绑定） -->
        <!-- or to manually control the datasynchronization（或者手动控制数据流，需要像这样手动监听changed事件） -->
        <codemirror ref="myCm"
                    :value="code"
                    :options="cmOptions"
                    @ready="onCmReady"
                    @focus="onCmFocus"
                    @input="onCmCodeChange">
        </codemirror>

      </v-flex>
      <v-flex xs12>
        <div class="add-comment">
          <!--<textarea name="comment" id="comment" cols="30" rows="10" placeholder="Insert your commment here" v-model="comment.body"></textarea>-->
          <v-layout row>
            <v-text-field
              name="input-7-1"
              full-width
              multi-line
              single-line
              v-model="comment"
              placeholder="Leave a comment here"
            ></v-text-field>
          </v-layout>
        </div>
      </v-flex>
      <v-btn
        @click="makeCommit"
      >
        Commit New File
      </v-btn>
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

  // require more codemirror resource...

  export default {
    name: 'CreateCommit',
    components: {
      codemirror
    },
    data () {
      return {
        branches: [],
        repositoryOwner: this.$route.params.owner,
        repositoryName: this.$route.params.repo,
        selectedHead: null,
        comment: '',
        headRef: null,
        pointedCommit: null,
        code: '// Insert code here',
        cmOptions: {
          // codemirror options
          tabSize: 4,
          mode: 'text/javascript',
          lineNumbers: true,
          line: true
          // more codemirror options, 更多 codemirror 的高级配置...
        },
        blobSha: null,
        blobUrl: null,
        tree: null
      }
    },
    mounted () {
      var _self = this
      _self.axiosInstance.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/branches').then(function (result) {
        result.data.forEach(function (each) {
          _self.branches.push({ text: each.name, sha: each.commit.sha })
        })
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
      },
      makeCommit () {
        var _self = this
        _self.axiosInstance.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/git/refs/heads/' + _self.selectedHead.text).then(function (response) {
          _self.headRef = response.data
        }).then(function () {
          _self.axiosInstance.get(_self.headRef.object.url).then(function (response) {
            _self.pointedCommit = response.data
          }).then(function () {
            _self.axiosInstance.post('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/git/blobs', {
              content: _self.code,
              encoding: 'base64'
            }).then(function (response) {
              console.log('made blob ' + response.data)
              _self.blobSha = response.data.sha
              _self.blobUrl = response.data.url
              _self.axiosInstance.get(_self.pointedCommit.tree.url).then(function (response) {
                _self.tree = response.data
                _self.tree.tree.push({
                  path: 'Test',
                  mode: '100644',
                  type: 'blob',
                  sha: _self.blobSha
                })
              }).then(function (response) {
                _self.axiosInstance.post('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/git/trees', {
                  base_tree: _self.tree.sha,
                  tree: _self.tree.tree
                }).then(function (response) {
                  var parents = []
                  parents.push(_self.pointedCommit.sha)
                  _self.axiosInstance.post('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/git/commits', {
                    message: _self.comment,
                    parents: parents,
                    tree: _self.tree.sha
                  }).then(function (response) {
                    console.log(response.data)
                    _self.axiosInstance.patch('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/git/refs/heads/' + _self.selectedHead.text, {
                      sha: response.data.sha
                    }).then(function () {
                      console.log('commited')
                    })
                  })
                })
              })
            })
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
