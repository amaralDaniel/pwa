<template>
  <v-container id="create-file">
    <v-layout row>
      <v-flex xs4>
        <v-subheader class="subheading">Filename</v-subheader>
      </v-flex>
      <v-flex xs8 sm6>
        <v-text-field
          name="input-2"
          label="Filename"
          value="Filename"
          v-model="filename"
          required
          :rules="[() => !!filename || 'This field is required']"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs4>
        <v-subheader class="subheading">Branch</v-subheader>
      </v-flex>
      <v-flex xs8 sm6>
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
    <v-flex xs12 class="text-sm-left text-xs-left">
      <!-- bidirectional data binding（双向数据绑定） -->
      <!-- or to manually control the datasynchronization（或者手动控制数据流，需要像这样手动监听changed事件） -->
      <codemirror ref="myCm"
                  :value="content"
                  :options="cmOptions"
                  @ready="onCmReady"
                  @focus="onCmFocus"
                  @input="onCmCodeChange">
      </codemirror>
    </v-flex>
    <v-flex xs12 text-sm-left text-xs-left>
      <!--<textarea name="comment" id="comment" cols="30" rows="10" placeholder="Insert your commment here" v-model="comment.body"></textarea>-->
      <v-layout row >
        <v-text-field
          name="input-7-1"
          full-width
          multi-line
          single-line
          v-model="message"
          placeholder="Leave a message here"
        ></v-text-field>
      </v-layout>
    </v-flex>
    <v-alert type="error" class="alert custom-alert" :value="error" id="error-alert">
      {{errorMessage}}
    </v-alert>
    <v-alert type="success" class="alert custom-alert" :value="success" id="success-alert">
      {{successMessage}}
    </v-alert>
    <v-btn
      @click="uploadFile"
      id="create-file-button"
      v-if="networkAvailable"
    >
      Commit & Push New File
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
  import axios from 'axios'

  // require more codemirror resource...

  export default {
    name: 'CreateFile',
    components: {
      codemirror
    },
    data () {
      return {
        branches: [],
        repositoryOwner: this.$route.params.owner,
        repositoryName: this.$route.params.repo,
        selectedBranch: null,
        message: '',
        pointedCommit: null,
        content: '// Insert code here',
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
        tree: null,
        filename: '',
        error: false,
        errorMessage: '',
        success: false,
        successMessage: ''
      }
    },
    mounted () {
      let _self = this
      axios.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/branches').then(function (result) {
        result.data.forEach(function (each) {
          _self.branches.push({text: each.name, sha: each.commit.sha})
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
        this.content = newCode
      },
      uploadFile () {
        let _self = this
        axios.put(`/repos/${_self.repositoryOwner}/${_self.repositoryName}/contents/${_self.filename}`, {
          message: _self.message,
          content: window.btoa(_self.content),
          branch: _self.selectedBranch.text
        }).then(function (response) {
          console.log(response.data)
          _self.successMessage = 'File created, you\'ll be redirected in 5 seconds'
          _self.success = true
          setTimeout(function () {
            _self.$router.push('/repo/' + _self.repositoryOwner + '/' + _self.repositoryName)
            _self.$destroy()
            _self.success = false
          }, 5000)
        }).catch(function (error) {
          _self.errorMessage = 'Something went wrong, check your inputs.'
          _self.error = true
          setTimeout(function () {
            _self.error = false
          }, 5000)
          throw error
        })
      }
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
