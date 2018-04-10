<template>
  <v-container  grid-list-md text-xs-center>
    <v-form v-model="valid" ref="form" lazy-validation>
      <v-layout row wrap>
        <v-flex xs4>
          <v-subheader class="subheading">Title</v-subheader>
        </v-flex>
        <v-flex xs12 sm6>
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
        <v-flex xs12 sm6>
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
    $_veeValidate: {
      validator: 'new'
    },
    name: 'CreatePullRequest',
    data () {
      return {
        valid: true,
        branches: [],
        repositoryOwner: this.$route.params.owner,
        repositoryName: this.$route.params.name,
        title: '',
        titleRules: [
          v => !!v || 'Title is required'
        ],
        comment: '',
        selectedHead: '',
        selectedBase: '',
        maintainerCanModifyCheckbox: false
      }
    },
    mounted () {
      var _self = this
      axios.get('http://api.github.com/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/branches').then(function (result) {
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
        _self.axiosInstance.post('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/pulls', {
          title: _self.title,
          body: _self.comment,
          head: _self.selectedHead.text,
          base: _self.selectedBase.text,
          maintainer_can_modify: _self.maintainerCanModifyCheckbox
        }).then(function (response) {
          if (response.status === 201) {
            console.log(response.data)
            _self.$router.push('/repo/' + _self.owner + '/' + _self.repo + '/pull/' + response.data.number)
          }
        })
      }
    },
    computed: {
      selectErrors () {
        const errors = []
        if (!this.$v.select.$dirty) return errors
        !this.$v.select.required && errors.push('Item is required')
        return errors
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

</style>
