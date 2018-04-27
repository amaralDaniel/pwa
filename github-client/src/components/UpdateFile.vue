<template>
    <v-container class="mt-5">
      <v-flex xs12 text-sm-left>
        <!-- bidirectional data binding（双向数据绑定） -->
        <!-- or to manually control the datasynchronization（或者手动控制数据流，需要像这样手动监听changed事件） -->
        <codemirror ref="myCm"
                    :value="code"
                    :options="cmOptions"
                    @ready="onCmReady"
                    @focus="onCmFocus"
                    @input="onCmCodeChange"
                    class="CodeMirror">
        </codemirror>
      </v-flex>
      <v-alert type="error" class="alert custom-alert" :value="error">
        {{errorMessage}}
      </v-alert>
      <v-alert type="success custom-alert" :value="success">
        {{successMessage}}
      </v-alert>
      <v-flex xs12>
        <div>
          <!--<textarea name="comment" id="comment" cols="30" rows="10" placeholder="Insert your commment here" v-model="comment.body"></textarea>-->
          <v-layout row>
            <v-text-field
              name="input-7-1"
              full-width
              multi-line
              single-line
              v-model="message"
              placeholder="Leave a message here"
            ></v-text-field>
          </v-layout>
        </div>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs4>
          <v-subheader class="subheading">Branch</v-subheader>
        </v-flex>
        <v-flex xs12 sm6>
          <v-select
            :items="branches"
            v-model="selectedBranch"
            label="Branch"
            single-line
            color="secondary"
            required
            autocomplete
            :rules="[() => !!selectedBranch || 'This field is required']"
          ></v-select>
        </v-flex>
      </v-layout>
      <v-btn
        @click="updateFile"
        class="mt-3"
      >
        Update File
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
  export default {
    name: 'UpdateFile',
    components: {
      codemirror
    },
    data () {
      return {
        path: this.$route.params.path,
        repositoryOwner: this.$route.params.owner,
        repositoryName: this.$route.params.repo,
        cmOptions: {
          tabSize: 4,
          mode: 'javascript',
          lineNumbers: true,
          line: true,
          message: ''
        },
        error: false,
        errorMessage: '',
        success: false,
        successMessage: '',
        blobSha: null,
        code: '',
        branches: [],
        selectedBranch: null

      }
    },
    mounted () {
      let _self = this
      _self.axiosInstance.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/branches').then(function (result) {
        result.data.forEach(function (each) {
          _self.branches.push({text: each.name, sha: each.commit.sha})
        })
      })
      _self.axiosInstance.get(`/repos/${_self.repositoryOwner}/${_self.repositoryName}/contents/${_self.path}`).then(function (response) {
        _self.blobSha = response.data.sha
        _self.code = decodeURIComponent(atob(response.data.content).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
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
      updateFile: function () {
        let _self = this
        _self.axiosInstance.put(`/repos/${_self.repositoryOwner}/${_self.repositoryName}/contents/${_self.path}`, {
          message: _self.message,
          content: window.btoa(_self.code),
          sha: _self.blobSha,
          branch: _self.selectedBranch.text
        }).then(function (response) {
          if (response.status === 200) {
            _self.successMessage = 'File updated, you\'ll be redirected in 5 seconds'
            _self.success = true
            setTimeout(function () {
              _self.$router.push('/repo/' + _self.repositoryOwner + '/' + _self.repositoryName)
              _self.$destroy()
            }, 5000)
          }
        }).catch(function (error) {
          console.log(error)
          _self.errorMessage = 'Something went wrong, check your inputs.'
          _self.error = true
        })
      }
    }
  }
</script>

<style scoped>

  .CodeMirror {
    border: 1px solid #eee;
    height: auto;
  }

  .custom-alert {
    position: absolute;
    top: 14%;
    left: 50%;
    right: 5%;
  }

</style>
