<template>
    <v-container text-md-left>
      <span class="title">{{issue.title}}</span>
      <p class="subheading">Created {{issue.created_at | moment("from")}} by
        <router-link :to="{name: 'User', params: { login: issue.user.login}}">
          <v-avatar>
            <img :src="issue.user.avatar_url" :alt="issue.user.login">
          </v-avatar>
          <span class="subheading">{{issue.user.login}}</span>
        </router-link>
      </p>
      <v-card class="text-sm-left body-1 pa-4">
        {{issue.body}}
      </v-card>
      <ul>
        <li v-for="comment in comments">
          <v-card ripple tile append replace class="my-1">
            <v-container fluid grid-list-lg text-md-left>
              <v-layout row>
                <v-flex >
                  <div>
                    <router-link :to="{name: 'User', params: { login: comment.user.login}}">
                      <v-avatar>
                        <img :src="comment.user.avatar_url" :alt="comment.user.login">
                      </v-avatar>
                      <span class="subheading">{{comment.user.login}}</span>
                    </router-link>
                    <span v-if="comment.author_association === 'OWNER'"><span color="success" class="subheading owner-tag" >{{comment.author_association}}</span></span>
                    <span class="body-2">{{comment.created_at | moment("from")}}</span>
                    <div class="body-1">{{comment.body}}</div>
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </li>
      </ul>
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
                v-model="comment.body"
                placeholder="Insert your commment here"
              ></v-text-field>
            </v-layout>
            <v-btn flat color="primary" v-on:click="pushComment" class="submit-button">Submit comment</v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-container>


</template>

<script>
  import Vue from 'vue'
  Vue.use(require('vue-moment'))
  export default {
    name: 'singleIssue',
    data: () => ({
      issue: null,
      comments: null,
      comment: {
        body: ''
      }
    }),
    computed: {
      owner () {
        return this.$route.params.owner
      },
      repo () {
        return this.$route.params.repo
      },
      number () {
        return this.$route.params.number
      }
    },
    mounted () {
      var _self = this
      _self.axiosInstance.get('/repos/' + this.owner + '/' + this.repo + '/issues/' + this.number).then(function (response) {
        console.log(response.data)
        _self.issue = response.data
      })
      _self.axiosInstance.get('/repos/' + this.owner + '/' + this.repo + '/issues/' + this.number + '/comments').then(function (response) {
        _self.comments = response.data
      })
    },
    methods: {
      pushComment: function () {
        var _self = this
        _self.axiosInstance.post('/repos/' + this.owner + '/' + this.repo + '/issues/' + this.number + '/comments', {
          body: _self.comment.body
        }).then(function (response) {
          if (response.status === 201) {
            console.log('added comment')
          }
        })
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import '../styles/variables.scss'

  .owner-tag
    border-style: solid
    border-width: 1px
    border-color: lightgrey
    padding: 2px 3px
    background-color: $primary
    font-weight: bold
    color: white
    -webkit-border-radius: 1px
    -moz-border-radius: 1px
    border-radius: 1px

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
