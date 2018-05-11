<template>
  <div>
    <v-container grid-list-xl text-xs-center fluid class="mt-3">
      <v-card height="10vh">
        <v-layout align-center justify-center>
          <button class="icon" v-bind:class="{isTrue: isStarred}" v-on:click="starLogic">
            <i class="fas fa-star"></i>
          </button>
          <span>{{repo.stargazers_count}}</span>
          <button class="icon" v-bind:class="{isTrue: isWatched}" v-on:click="watchLogic">
            <i class="fas fa-eye"></i>
          </button>
          <span>{{repo.watchers_count}}</span>
          <button v-if="repo.has_wiki" class="icon" v-on:click="">
            <i class="fas fa-book"></i>
          </button>
          <button class="icon" v-on:click="forkRepo">
            <i class="fas fa-code-branch"></i>
          </button>
          <span>{{repo.fork_count}}</span>
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
      <v-tabs-items v-model="currentItem" class="py-5">
        <v-tab-item
          v-for="item in items"
          :key="item"
          :id="item"
        >
          <v-card flat class="card-item">
            <v-card-text>
              <h2>{{ item }}</h2>
              <v-layout text-md-left class="my-2 mx-2">
                <div v-if="item === 'Readme'">
                  <div v-if="readme === ''">
                    <span class="body-2 grey--text text-xs-left text-sm-left">Nothing to show here</span>
                  </div>
                  <vue-markdown v-bind:source="readme" class="text-xs-left text-sm-left"></vue-markdown>
                </div>
                <div v-if="item === 'Files'">
                  <TreeView></TreeView>
                </div>
                <div v-if="item === 'Commits'">
                  <ul>
                    <li v-for="commit in commits" class="text-xs-left text-sm-left">
                      <router-link :to="{name: 'Commit', params: {owner: repositoryOwner, repo: repositoryName, sha: commit.sha}}">
                        <span class="body-2">{{commit.commit.message}}</span></router-link>
                      by
                      <router-link :to="{name: 'User', params: {login: commit.author.login}}">
                        <span class="body-1 primary" >{{commit.author.login}}</span>
                      </router-link>
                    </li>
                  </ul>
                </div>
                <div v-if="item === 'Contributors'">
                  <ul >
                    <li v-for="user in contributors">
                      <router-link :to="{name: 'User', params: {login: user.login}}">
                        <v-layout align-center class="my-2" row>
                          <v-avatar>
                            <img :src="user.avatar_url" :alt="user.login">
                          </v-avatar>
                          <v-spacer></v-spacer>
                          <span class="body-2">{{user.login}}</span>
                        </v-layout>
                      </router-link>
                    </li>
                  </ul>
                </div>
                <div v-if="item === 'Issues'">
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
                    <li v-for="issue in issues" class="text-xs-left text-sm-left">
                      <router-link :to="{name: 'singleIssue', params: { owner: issue.user.login, repo: repositoryName, number: issue.number }}">
                        <v-card ripple tile append replace xs2 class="my-2">
                          <v-card-title primary-title class="text-xs-left" >
                            <v-layout row>
                              <v-flex xs12 sm12>
                                <span class="title">{{issue.title}}</span>
                              </v-flex>
                            </v-layout>
                          </v-card-title>
                          <v-card-text>
                            <router-link :to="{name: 'User', params: {login: issue.user.login}}">
                              <v-avatar>
                                <img :src="issue.user.avatar_url" :alt="issue.user.login">
                              </v-avatar>
                              <span class="body-2">{{issue.user.login}}</span>
                            </router-link>
                            <span class="body-2 grey--text text-sm-left">created this issue {{ issue.created_at | moment("from") }}</span>
                          </v-card-text>
                        </v-card>
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
                    <li v-for="pr in pullRequests" class="text-xs-left text-sm-left">
                      <v-layout row>
                        <router-link :to="{name: 'PullRequest', params: {owner: repositoryOwner, name: repositoryName, number: pr.number}}">
                          <v-card ripple tile append replace xs6 class="my-2">
                            <v-card-title primary-title>
                              <span class="body-2">#{{pr.number}} {{pr.title}} by <router-link :to="{name: 'User', params: {login: pr.author.login}}">{{pr.author.login}}</router-link></span>
                            </v-card-title>
                            <v-card-text>
                              <v-spacer></v-spacer>
                              <span class="body-2">Created {{pr.created_at | moment("from")}}</span>
                              <v-spacer></v-spacer>
                              <span class="body-2">State: {{pr.state}}</span>
                              <v-spacer></v-spacer>
                              <span class="body-2" :v-if="pr.merged">Merged {{pr.merged_at | moment("from")}}</span>
                              <v-spacer></v-spacer>
                              <span class="body-2" :v-if="pr.mer">Closed {{pr.closed_at | moment("from")}}</span>
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
    </v-container>
  </div>
</template>

<script>
  // import GitHub from 'github-api'
  // import store from '../store'
  import VueMarkdown from 'vue-markdown'
  import TreeView from '@/components/TreeView'

  export default {
    name: 'visitedRepo',
    components: {
      VueMarkdown,
      TreeView
    },
    data () {
      return {
        repositoryOwner: this.$route.params.owner,
        repositoryName: this.$route.params.name,
        contents: [],
        contributors: [],
        currentItem: 'Readme',
        items: [
          'Readme', 'Files', 'Commits', 'Issues', 'Pull requests', 'Contributors'
        ],
        readme: '',
        commits: [],
        avatarSize: '56',
        repo: null,
        repoGH: null,
        starred: null,
        starCount: 0,
        watched: false,
        watchCount: 0,
        forkCount: 0,
        stateToSubscribe: '',
        collaborators: null,
        viewerHasStarred: null,
        issues: null,
        pullRequests: null,
        authUser: null,
        viewerIsWatching: null
      }
    },
    mounted () {
      var _self = this
      _self.axiosInstance.get('/user').then(function (response) {
        _self.authUser = response.data
      }).catch(function (error) {
        throw error
      })
      _self.repoGH = _self.gh.getRepo(this.repositoryOwner, this.repositoryName)
      _self.axiosInstance.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName).then(function (response) {
        _self.repo = response.data
      })
      _self.axiosInstance.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/readme').then(function (response) {
        _self.readme = _self.content = decodeURIComponent(atob(response.data.content).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
      })
      _self.axiosInstance.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/commits').then(function (result) {
        // console.log(result.data)
        result.data.forEach(function (each) {
          _self.commits.push(each)
        })
      })
      _self.axiosInstance.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/issues', {
        params: {
          subscribed: true,
          ignored: false
        }
      }).then(function (response) {
        _self.issues = response.data
      }).catch(function (error) {
        throw error
      })
      _self.axiosInstance.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/pulls').then(function (response) {
        _self.pullRequests = response.data
      }).catch(function (error) {
        throw error
      })
      _self.axiosInstance.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/contributors').then(function (response) {
        // console.log(result.data)
        response.data.forEach(function (each) {
          _self.contributors.push(each)
        })
      })
    },
    methods: {
      starLogic: function (event) {
        var _self = this
        if (_self.isStarred) {
          _self.axiosInstance.delete('/user/starred/' + _self.repositoryOwner + '/' + _self.repositoryName).then(function (response) {
            if (response.status === 204) {
              _self.starred = false
            }
          }).catch(function (error) {
            throw error
          })
        } else {
          _self.axiosInstance.put('/user/starred/' + _self.repositoryOwner + '/' + _self.repositoryName).then(function (response) {
            if (response.status === 204) {
              _self.starred = true
            }
          }).catch(function (error) {
            throw error
          })
        }
      },
      forkLogic: function () {
        var _self = this

        _self.axiosInstance.post('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/forks').then(response => {
          if (response.status === 202) {
            _self.viewerHasForked = true
            _self.$router.push('/repos')
          }
        }).catch(error => {
          throw error
        })
      },
      watchLogic: function () {
        var _self = this
        if (!_self.isWatched) {
          _self.axiosInstance.put('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/subscription', {
            params: {
              subscribed: true,
              ignored: false
            }
          }).then(response => {
            if (response.status === 200) {
              _self.watched = true
            }
          }).catch(function (error) {
            throw error
          })
        } else {
          _self.axiosInstance.delete('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/subscription').then(response => {
            if (response.status === 204) {
              _self.watched = false
            }
          }).catch(function (error) {
            throw error
          })
        }
      },
      forkRepo: function () {
        var _self = this
        _self.repo.fork().then(function (response) {
          if (response.status === 202) {
            _self.$router.push('/repos')
          }
        })
      }
    },
    computed: {
      isStarred: function () {
        var _self = this
        if (_self.viewerHasStarred) {
          _self.starred = true
        }
        if (_self.starred) return true
        else return false
      },
      isWatched: function () {
        var _self = this
        if (_self.viewerIsWatching) {
          _self.watched = true
        }
        if (_self.watched) return true
        else return false
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
