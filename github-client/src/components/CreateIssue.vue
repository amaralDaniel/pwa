<template>
  <v-container  grid-list-md text-xs-center id="create-issue">
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
      </v-layout>
      <v-btn
        @click="pushNewIssue"
        :disabled="!valid"
      >
        Create New Issue
      </v-btn>
      <v-btn @click="clear">clear</v-btn>
    </v-form>
  </v-container>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'CreateIssue',
    data () {
      return {
        valid: true,
        title: '',
        titleRules: [
          v => !!v || 'Title is required'
        ],
        comment: ''
      }
    },
    computed: {
      owner () {
        return this.$route.params.owner
      },
      repo () {
        return this.$route.params.name
      },
      number () {
        return this.$route.params.number
      }
    },
    methods: {
      clear () {
        this.$refs.form.reset()
      },
      pushNewIssue () {
        if (this.$refs.form.validate()) {
          // Native form submission is not yet supported
          var _self = this
          axios.post('/repos/' + _self.owner + '/' + _self.repo + '/issues', {
            title: _self.title,
            body: _self.comment
          }).then(function (response) {
            if (response.status === 201) {
              _self.successMessage = 'Issue created, you\'ll be redirected in 5 seconds'
              _self.success = true
              setTimeout(function () {
                _self.$router.push('/repo/' + _self.owner + '/' + _self.repo + '/issues/' + response.data.number)
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
