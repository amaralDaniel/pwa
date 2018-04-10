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
          _self.axiosInstance.post('/repos/' + _self.owner + '/' + _self.repo + '/issues', {
            title: _self.title,
            body: _self.comment
          }).then(function (response) {
            _self.$router.push('/repo/' + _self.owner + '/' + _self.repo + '/issues/' + response.data.number)
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
</style>
