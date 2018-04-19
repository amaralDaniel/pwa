<template>
  <v-container grid-list-md text-sm-left class="mt-4">
    <span class="title">{{repository.pullRequest.title}} #{{repository.pullRequest.number}} by
      <router-link :to="{name: 'User', params: { login: repository.pullRequest.author.login}}">
            <v-avatar>
              <img :src="repository.pullRequest.author.avatarUrl" :alt="repository.pullRequest.author.login">
            </v-avatar>
            <span class="subheading">{{repository.pullRequest.author.login}}</span>
          </router-link>
    </span>
    <span color="success" class="subheading owner-tag" >{{repository.pullRequest.authorAssociation}}</span>
    <span>{{repository.pullRequest.createdAt | moment("from")}}</span>
    <v-container fluid align-content-start>
      <v-layout row wrap>
        <v-card tile append replace>
          <v-card-title primary-title>
            <div >
              <span class="body-2">{{repository.pullRequest.body}}</span>
            </div>
          </v-card-title>
        </v-card>
      </v-layout>
    </v-container>
    <v-layout row wrap>
      <v-flex xs12>
        <ul>
          <li v-for="comment in repository.pullRequest.comments.nodes">
            <v-card tile append replace>
              <router-link :to="{name: 'User', params: { login: comment.author.login}}">
                <v-avatar class="my-2 mx-2">
                  <img :src="comment.author.avatarUrl" :alt="comment.author.login">
                </v-avatar>
                <span class="subheading">{{comment.author.login}}</span>
              </router-link>
              is <span color="success" class="subheading owner-tag" > {{comment.authorAssociation}}</span><span> and commented {{comment.createdAt | moment("from")}}</span>
              <v-card-title primary-title>
                <div >
                  <p class="headline text-sm-left">{{comment.body}}</p>

                </div>
              </v-card-title>
            </v-card>
          </li>
        </ul>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <ul>
          <li v-for="review in repository.pullRequest.reviews.nodes">
            <v-card tile append replace>
              <router-link :to="{name: 'User', params: { login: review.author.login}}">
                <v-avatar class="my-2 mx-2">
                  <img :src="review.author.avatarUrl" :alt="review.author.login">
                </v-avatar>
                <span class="subheading">{{review.author.login}}</span>
              </router-link>
              is <span color="success" class="subheading owner-tag" >{{review.authorAssociation}}</span><span> and reviewed {{review.createdAt | moment("from")}}</span>
              <v-card-title primary-title>
                <div >
                  <p class="headline text-sm-left">{{review.bodyText}}</p>
                </div>
              </v-card-title>
            </v-card>
          </li>
        </ul>
      </v-flex>
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
    </v-layout>
  </v-container>

</template>

<script>
  import Vue from 'vue'
  import gql from 'graphql-tag'
  Vue.use(require('vue-moment'))
  export default {
    name: 'PullRequest',
    data () {
      return {
        repositoryName: '',
        repositoryOwner: '',
        repository: null,
        comment: {
          body: null
        },
        viewer: this.$store.getters.getViewer
      }
    },
    beforeCreate () {
      console.log(this.$route.params.owner, this.$route.params.name, this.$route.params.number)
    },
    apollo: {
      repository: {
        query: gql`query getpr($repo_owner: String!, $repo_name: String!, $number: Int!, $n: Int!) {
                    repository(owner: $repo_owner, name: $repo_name){
                      pullRequest(number: $number) {
                      title
                      id
                      body
                      closed
                      closedAt
                      state
                      viewerDidAuthor
                      viewerCanReact
                      viewerCanSubscribe
                      viewerSubscription
                      viewerCannotUpdateReasons
                      authorAssociation
                        createdAt
                      repository{
                        name
                      }
                      headRepositoryOwner{
                        login
                        avatarUrl
                      }
                      number
                        author{
                          login
                          avatarUrl
                        }
                        assignees(last: $n){
                          nodes {
                            avatarUrl
                            login
                          }
                        }
                        comments(last: $n) {
                          nodes{
                            author{
                              login
                              avatarUrl
                            }
                            authorAssociation
                            createdAt
                            body
                            issue{
                              author{
                                login
                              }
                              number
                              repository{
                                name
                              }
                            }
                          }
                        }
                        commits(last: 100) {
                          nodes {
                          id
                          commit{
                              author {
                                date
                                name
                              }
                              messageBody

                          }
                        }


                        }
                        reviews(last: 100){
        nodes{
          author{
            login
            avatarUrl
          }
          body
          bodyHTML
          bodyText
          createdAt
          authorAssociation
          state
        }
      }
                      }
                    }
                  }`,
        variables () {
          return {
            repo_owner: this.$route.params.owner,
            repo_name: this.$route.params.name,
            number: parseInt(this.$route.params.number),
            n: 100
          }
        }
      }
    },
    methods: {
      pushComment: function () {
        var _self = this
        console.log('id is ' + _self.viewer.viewer.id)
        _self.$apollo.mutate({
          mutation: gql`mutation pushComment($body: String!, $clientId: String!, $subId: ID!) {
                        addComment(input:{body: $body, clientMutationId: $clientId, subjectId: $subId }) {
                          clientMutationId:clientMutationId
                          subject:subject {
                            id
                          }
                        }
                      }`,
          variables: {
            body: _self.comment.body,
            clientId: _self.viewer.viewer.id,
            subId: _self.repository.pullRequest.id
          }
        }).then(function (response) {
          if (response.status === 200) {
            this.$apollo.queries.repository.refetch()
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
