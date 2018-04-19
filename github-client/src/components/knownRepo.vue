<template>
  <div>

    <v-card height="10vh">
      <v-layout align-center justify-center>
        <button class="icon" v-bind:class="{isTrue: isStarred}" v-on:click="starLogic">
          <i class="fas fa-star"></i>
        </button>
        <span>{{repository.stargazers.totalCount}}</span>
        <button class="icon" v-bind:class="{isTrue: isWatched}" v-on:click="watchLogic">
          <i class="fas fa-eye"></i>
        </button>
        <span>{{repository.watchers.totalCount}}</span>
        <button v-if="repository.hasWikiEnabled" class="icon" v-on:click="">
          <i class="fas fa-book"></i>
        </button>
        <button class="icon" v-on:click="">
          <i class="fas fa-code-branch"></i>
        </button>
        <span>{{repository.forkCount}}</span>
        <button class="icon" v-on:click="goToMakeCommit">
          <i class="fas fa-upload"></i>
        </button>
      </v-layout>
    </v-card>
    <v-tabs
      fixed-tabs
      v-model="currentItem"
      color="transparent"
      slider-color="secondary"
      slot="extension"
    >
      <v-tab
        v-for="item in items"
        :key="item"
        :href="'#' + item"
      >
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="currentItem">
      <v-tab-item
        v-for="item in items"
        :key="item"
        :id="item"
      >
        <v-card flat class="card-item">
          <v-card-text>
            <v-layout text-sm-left>
              <div v-if="item === 'Readme'">
                <div v-if="readme === ''">
                  <span class="body-2 grey--text">Nothing to show here</span>
                </div>
                <vue-markdown v-bind:source="readme" ></vue-markdown>
              </div>
              <div v-if="item === 'Files'">
                <TreeView></TreeView>
              </div>
              <div v-if="item === 'Commits'">
                <ul>
                  <li v-for="commit in commits">
                    <router-link :to="{name: 'Commit', params: {owner: repositoryOwner, repo: repositoryName, sha: commit.sha}}" class="body-2">{{commit.commit.message}}</router-link>
                  </li>
                </ul>
              </div>
              <div v-if="item === 'Collaborators'">
                <ul >
                  <li v-for="user in repository.collaborators.nodes">
                    <router-link :to="{name: 'User', params: {login: user.login}}">
                      <v-layout align-center class="mb-2" row>
                        <v-avatar>
                          <img :src="user.avatarUrl" alt="John">
                        </v-avatar>
                        <v-spacer></v-spacer>
                        <span class="body-2">{{user.login}}</span>
                      </v-layout>
                    </router-link>
                  </li>
                </ul>
              </div>
              <div v-if="item === 'Issues'">
                <v-flex row>
                  <router-link :to="{name: 'CreateIssue'}">
                    <v-btn
                      color="pink"
                      small
                      absolute
                      top
                      right
                      class="mt-5 mr-2"
                    >
                      Create Issue
                    </v-btn>
                  </router-link>
                  <ul >
                    <li v-for="issue in repository.issues.nodes">
                      <router-link :to="{name: 'singleIssue', params: { owner: issue.author.login, repo: repositoryName, number: issue.number }}">
                        <v-card>
                          <v-layout row text-md-left>
                            <v-layout class="mb-2" column>
                              <router-link :to="{name: 'User', params: {login: issue.author.login}}">
                                <v-avatar>
                                  <img :src="issue.author.avatarUrl" alt="John">
                                </v-avatar>
                                <span class="body-2">{{issue.author.login}}</span>
                              </router-link>
                            </v-layout>
                            <div>{{issue.title}}</div>
                          </v-layout>
                        </v-card>
                      </router-link>
                    </li>
                  </ul>
                </v-flex>
              </div>
              <div v-if="item === 'Contributors'">
                <ul >
                  <li v-for="user in contributors">

                    <router-link :to="{name: 'User', params: {login: user.login}}">
                      <v-layout align-center class="mb-2" row>
                        <v-avatar>
                          <img :src="user.avatar_url" alt="John">
                        </v-avatar>
                        <v-spacer></v-spacer>
                        <span class="body-2">{{user.login}}</span>
                      </v-layout>
                    </router-link>
                  </li>
                </ul>
              </div>
              <div v-if="item === 'Pull requests'">
                <router-link :to="{name: 'CreatePullRequest'}">
                  <v-btn
                    color="pink"
                    small
                    absolute
                    top
                    right
                    class="mt-5 mr-2"
                  >
                    Create Pull Request
                  </v-btn>
                </router-link>
                <ul >
                  <li v-for="pr in repository.pullRequests.nodes">
                    <v-layout row>
                      <router-link :to="{name: 'PullRequest', params: {owner: repositoryOwner, name: repositoryName, number: pr.number}}">
                        <v-card ripple tile append replace style="width: 75vh;" class="my-2">
                          <v-card-title primary-title>
                            <span class="body-2">#{{pr.number}} {{pr.title}} by <router-link :to="{name: 'User', params: {login: pr.author.login}}">{{pr.author.login}}</router-link></span>
                          </v-card-title>
                          <v-card-text>
                            <v-spacer></v-spacer>
                            <span class="body-2">Created {{pr.createdAt | moment("from")}}</span>
                            <v-spacer></v-spacer>
                            <span class="body-2">State: {{pr.state}}</span>
                            <v-spacer></v-spacer>
                            <span class="body-2" :v-if="pr.merged">Merged {{pr.mergedAt | moment("from")}}</span>
                            <v-spacer></v-spacer>
                            <span class="body-2" :v-if="pr.mer">Closed {{pr.closedAt | moment("from")}}</span>
                          </v-card-text>
                        </v-card>
                      </router-link>
                    </v-layout>
                  </li>
                </ul>
              </div>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
  // import GitHub from 'github-api'
  // import store from '../store'
  import Vue from 'vue'
  import VueMarkdown from 'vue-markdown'
  import gql from 'graphql-tag'
  import TreeView from '@/components/TreeView'
  Vue.use(require('vue-moment'))

  export default {
    name: 'singleRepo',
    components: {
      VueMarkdown,
      TreeView
    },
    data () {
      return {
        repositoryOwner: this.$route.params.owner,
        repositoryName: this.$route.params.name,
        contributors: [],
        currentItem: 'Readme',
        items: [
          'Readme', 'Files', 'Commits', 'Collaborators', 'Issues', 'Contributors', 'Pull requests'
        ],
        readme: '',
        commits: [],
        avatarSize: '56',
        repo: null,
        repository: null,
        viewer: null,
        starred: null,
        starCount: 0,
        watched: false,
        watchCount: 0,
        forkCount: 0,
        stateToSubscribe: '',
        collaborators: null
      }
    },
    apollo: {
      repository: {
        query: gql`query($repo_name: String!, $repo_owner: String!, $number: Int!) {
                      repository(owner: $repo_owner, name: $repo_name){
                        id
                        viewerSubscription
                        viewerCanSubscribe
                        viewerHasStarred
                        viewerPermission
                        forkCount
                        hasWikiEnabled
                        stargazers{
                          totalCount
                        }
                        watchers{
                          totalCount
                        }
                        collaborators(last: $number) {
                          nodes {
                            login
                            avatarUrl
                          }
                        }
                        issues(last: 100) {
                          nodes{
                            author{
                              avatarUrl
                              login
                            }
                            title
                            closedAt
                            number
                            state
                            id
                            publishedAt
                          }
                        }
                        pullRequests(first:100){
                          nodes{
                            id
                            author{
                              login
                              avatarUrl
                            }
                            state
                            body
                            merged
                            mergedAt
                            closed
                            closedAt
                            createdAt
                            number
                            title
                          }
                        }
                      }
                     }
        `,
        variables () {
          return {
            repo_name: this.repositoryName,
            repo_owner: this.repositoryOwner,
            number: 100
          }
        },
        fetchPolicy: 'cache-then-network'
      }
    },
    mounted () {
      var _self = this

      var user = _self.gh.getUser()
      console.log(user)
      _self.repo = _self.gh.getRepo(this.repositoryOwner, this.repositoryName)
      _self.axiosInstance.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/commits').then(function (result) {
        // console.log(result.data)
        result.data.forEach(function (each) {
          _self.commits.push(each)
        })
      })
      _self.axiosInstance.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/contributors').then(function (response) {
        // console.log(result.data)
        response.data.forEach(function (each) {
          _self.contributors.push(each)
        })
      })
      _self.axiosInstance.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/readme').then(function (response) {
        _self.readme = _self.content = decodeURIComponent(atob(response.data.content).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
      })
    },
    methods: {
      starLogic: function (event) {
        var _self = this
        if (this.starred) {
          _self.repo.unstar().then(function (response) {
            _self.starred = false
            console.log('unstarred' + response)
          })
        } else {
          _self.repo.star().then(function (response) {
            _self.starred = true
            console.log('starred' + response)
          })
        }
      },
      forkLogic: function () {
        var _self = this
        if (_self.viewerHasForked) {
          _self.showForkTooltip = true
        } else {
          _self.repo.fork().then(function (response) {
            _self.viewerHasForked = true
            console.log(response)
          })
        }
      },
      watchLogic: function () {
        var _self = this
        if (!_self.watched) {
          console.log('unwatch logic')
          _self.stateToSubscribe = 'SUBSCRIBED'
          _self.$apollo.mutate({
            mutation: gql`mutation subscribeRepository($user: String!, $state: SubscriptionState!, $subId: ID!) {
                        updateSubscription(input:{clientMutationId: $user, state: $state, subscribableId: $subId }) {
                          clientMutationId:clientMutationId
                          subscribable:subscribable {
                            id
                          }
                        }
                      }`,
            variables: {
              user: _self.viewer.id,
              state: _self.stateToSubscribe,
              subId: _self.repository.id
            }
          })
          _self.watched = true
        } else {
          console.log('watch logic')
          _self.stateToSubscribe = 'UNSUBSCRIBED'
          _self.$apollo.mutate({
            mutation: gql`mutation subscribeRepository($user: String!, $state: SubscriptionState!, $subId: ID!) {
                        updateSubscription(input:{clientMutationId: $user, state: $state, subscribableId: $subId }) {
                          clientMutationId:clientMutationId
                          subscribable:subscribable {
                            id
                          }
                        }
                      }`,
            variables: {
              user: _self.viewer.id,
              state: _self.stateToSubscribe,
              subId: _self.repository.id
            }
          })
          _self.watched = false
          console.log(_self.watched)
        }
      },
      goToMakeCommit: function () {
        this.$router.push({
          name: 'CreateCommit',
          params: {
            owner: this.repositoryOwner,
            repo: this.repositoryName
          }
        })
      }
    },
    computed: {
      isStarred: function () {
        var _self = this
        if (_self.repository) {
          console.log(_self.repository.viewerHasStarred)
          if (_self.repository.viewerHasStarred) {
            _self.starred = true
          }
          if (_self.starred) return true
          else return false
        }
      },
      isWatched: function () {
        var _self = this
        if (_self.repository) {
          if (_self.repository.viewerSubscription === 'SUBSCRIBED') {
            _self.watched = true
          }
          if (_self.watched) return true
          else return false
        }
      },
      viewerIsOwner: function () {
        // var _self = this
        return true
        // if (_self.viewer.login === _self.repository.repositoryOwner) return true
        // else return false
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import '../styles/variables.scss'

  .icon
    margin: 1vh 1vw 1vh
    font-size: 2em

  .icon:focus
    outline: none

  .isTrue
    margin-right: 1vw
    font-size: 2em
    color: green

  .card-item
    min-height: 15vh

  li a
    text-decoration: none !important
    color: $secondary
</style>
