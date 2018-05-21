<template>
  <v-container  grid-list-md text-xs-center>
    <v-alert type="error" class="alert custom-alert" :value="error">
      {{errorMessage}}
    </v-alert>
    <v-alert type="success custom-alert" :value="success">
      {{successMessage}}
    </v-alert>
    <v-form v-model="valid" ref="form" lazy-validation>
      <v-layout row wrap>
        <v-flex xs4>
          <v-subheader class="subheading">Title</v-subheader>
        </v-flex>
        <v-flex xs8 sm6>
          <v-text-field
            label="Title"
            v-model="title"
            :rules="titleRules"
            :counter="50"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs4>
          <v-subheader class="subheading">Base</v-subheader>
        </v-flex>
        <v-flex xs8 sm6>
          <v-select
            :items="branches"
            v-model="selectedBase"
            label="Base"
            single-line
            color="secondary"
            required
            autocomplete
            :rules="[() => !!selectedBase || 'This field is required']"
          ></v-select>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs4>
          <v-subheader class="subheading">Head</v-subheader>
        </v-flex>
        <v-flex xs8 sm6>
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
      <v-layout row wrap>
        <v-flex xs12 sm6>
          <v-checkbox color="primary" label="Maintainer can modify" v-model="maintainerCanModifyCheckbox"></v-checkbox>
        </v-flex>
      </v-layout>
      <v-btn
        @click="pushNewPR"
        :disabled="!valid"
      >
        Create New Pull Request
      </v-btn>
      <v-btn @click="clear">clear</v-btn>
    </v-form>
  </v-container>

</template>

<script>
  import axios from 'axios'
  export default {
    name: 'CreatePullRequest',
    data () {
      return {
        valid: true,
        branches: [],
        repositoryOwner: this.$route.params.owner,
        repositoryName: this.$route.params.repo,
        title: '',
        titleRules: [
          v => !!v || 'Title is required'
        ],
        comment: '',
        selectedHead: '',
        selectedBase: '',
        maintainerCanModifyCheckbox: false,
        error: false,
        errorMessage: '',
        success: false,
        successMessage: ''
      }
    },
    mounted () {
      var _self = this
      axios.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/branches').then(function (result) {
        console.log(result.data)
        result.data.forEach(function (each) {
          console.log(each.name)
          _self.branches.push({ text: each.name })
        })
      })
    },
    methods: {
      clear () {
        this.$refs.form.reset()
      },
      pushNewPR: function () {
        var _self = this
        console.log(_self.title)
        console.log(_self.comment)
        console.log(_self.selectedHead.text)
        console.log(_self.selectedBase.text)
        console.log(_self.maintainerCanModifyCheckbox)
        axios.post('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/pulls', {
          title: _self.title,
          body: _self.comment,
          head: _self.selectedHead.text,
          base: _self.selectedBase.text,
          maintainer_can_modify: _self.maintainerCanModifyCheckbox
        }).then(function (response) {
          if (response.status === 201) {
            _self.successMessage = 'File updated, you\'ll be redirected in 5 seconds'
            _self.success = true
            setTimeout(function () {
              _self.$router.push('/repo/' + _self.repositoryOwner + '/' + _self.repositoryName + '/pull/' + response.data.number)
              _self.$destroy()
            }, 5000)
          }
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

<style lang="sass" scoped>
  @import '../styles/variables.scss'

  .add-comment
    display: flex
    flex-direction: column
    flex-wrap: nowrap
    justify-content: space-around
    align-items: stretch
    align-content: stretch
    font-size: small

  .submit-button
    width: fit-content
    font-size: small
    color: $primary
    float: right
    margin: 2vh 0 1vh auto

  .custom-alert
    position: absolute
    top: 14%
    left: 50%
    right: 5%

</style>
