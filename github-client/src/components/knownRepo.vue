<template>
  <div id="known-repo-container">
    <v-alert type="error" class="alert custom-alert" :value="error" id="error-alert">
      {{errorMessage}}
    </v-alert>
    <v-alert type="success" class="alert custom-alert" :value="success" id="success-alert">
      {{successMessage}}
    </v-alert>
    <v-alert :value="warning" type="warning" class="alert custom-alert" id="warning-alert">
      {{warningMessage}}
    </v-alert>

    <v-container grid-list-xl text-xs-center fluid class="mt-3" v-if="repo">
      <v-card height="10vh">
        <v-layout align-center justify-center>
          <button class="icon" v-bind:class="{isTrue: isStarred}" v-on:click="starLogic" id="star-button">
            <i class="material-icons">
              star
            </i>
          </button>
          <span>{{repo.stargazers_count}}</span>
          <button class="icon" v-bind:class="{isTrue: isWatched}" v-on:click="watchLogic" id="watch-button">
            <i class="material-icons">
              visibility
            </i>
          </button>
          <span>{{repo.watchers_count}}</span>
          <button class="icon" v-on:click="forkLogic" id="fork-button">
            <i class="material-icons">
              call_split
            </i>
          </button>
          <span>{{repo.fork_count}}</span>
          <button class="icon" v-on:click="goToUploadFile" id="upload-button">
            <i class="material-icons">
              backup
            </i>
          </button>
          <button class="icon" id="save-button" v-on:click="saveRepo" >
            <i class="material-icons">
              save
            </i>
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
            <v-card-text >
              <v-layout text-sm-left class="my-2 mx-2">
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
                <div v-if="item === 'Collaborators'">
                  <ul >
                    <li v-for="user in collaborators" class="text-xs-left text-sm-left">
                      <router-link :to="{name: 'User', params: {login: user.login}}">
                        <v-layout align-center class="my-2" row>
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
                  </v-flex>
                </div>
                <div v-if="item === 'Contributors'">
                  <ul >
                    <li v-for="user in contributors" class="text-xs-left text-sm-left">

                      <router-link :to="{name: 'User', params: {login: user.login}}">
                        <v-layout class="my-2" row>
                          <v-avatar>
                            <img :src="user.avatar_url" alt="John Doe">
                          </v-avatar>
                          <v-spacer></v-spacer>
                          <span class="body-1">{{user.login}}</span>
                        </v-layout>
                      </router-link>
                    </li>
                  </ul>
                </div>
                <div v-if="item === 'Pull-requests'">
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
                        <v-flex fluid>
                          <router-link :to="{name: 'PullRequest', params: {owner: repositoryOwner, name: repositoryName, number: pr.number}}">
                            <v-card ripple tile append replace xs6 class="my-2">
                              <v-card-title primary-title>
                                <span class="body-2">#{{pr.number}} {{pr.title}} by <router-link :to="{name: 'User', params: {login: pr.user.login}}">{{pr.user.login}}</router-link></span>
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
                        </v-flex>
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
  import Vue from 'vue'
  import VueMarkdown from 'vue-markdown'
  import TreeView from '@/components/TreeView'
  import axios from 'axios'
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
          'Readme', 'Files', 'Commits', 'Collaborators', 'Issues', 'Contributors', 'Pull-requests'
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
        viewerIsWatching: null,
        error: false,
        errorMessage: '',
        success: false,
        successMessage: '',
        warning: false,
        warningMessage: '',
        contents: []
      }
    },
    beforeMount () {
      var _self = this
      axios.get('/user').then(function (response) {
        _self.authUser = response.data
      }).catch(function (error) {
        throw error
      })
      const idb = indexedDB.open('saved-repos', 1)
      idb.onsuccess = function () {
        var db = idb.result
        var tx = db.transaction('saved-repos', 'readwrite')
        var store = tx.objectStore('saved-repos')

        var getRepo = store.get('/gh/' + _self.repositoryOwner + '/' + _self.repositoryName)

        getRepo.onsuccess = function () {
          console.log('repo', getRepo.result)
          if (getRepo.result !== undefined) {
            _self.repoGH = getRepo.result.content

            var repo = store.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName)
            repo.onsuccess = function () {
              _self.repo = repo.result.content
            }
            var commits = store.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/commits')
            commits.onsuccess = function () {
              _self.commits = commits.result.content
            }
            var contributors = store.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/contributors')
            contributors.onsuccess = function () {
              _self.contributors = contributors.result.content
            }
            var readme = store.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/readme')
            readme.onsuccess = function () {
              _self.readme = readme.result.content
            }
            var collaborators = store.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/collaborators')
            collaborators.onsuccess = function () {
              _self.collaborators = collaborators.result.content
            }
            var viewerHasStarred = store.get('/user/starred/' + _self.repositoryOwner + '/' + _self.repositoryName)
            viewerHasStarred.onsuccess = function () {
              _self.viewerHasStarred = viewerHasStarred.result.content
            }
            var issues = store.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/issues')
            issues.onsuccess = function () {
              _self.issues = issues.result.content
            }
            var pullRequests = store.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/pulls')
            pullRequests.onsuccess = function () {
              _self.pullRequests = pullRequests.result.content
            }
            var viewerIsWatching = store.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/subscription')
            viewerIsWatching.onsuccess = function () {
              _self.viewerIsWatching = viewerIsWatching.result.content
            }
          } else {
            _self.repoGH = _self.gh.getRepo(this.repositoryOwner, this.repositoryName)
            axios.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName).then(function (response) {
              _self.repo = response.data
            })
            axios.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/commits').then(function (result) {
              // console.log(result.data)
              result.data.forEach(function (each) {
                _self.commits.push(each)
              })
            })
            axios.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/contributors').then(function (response) {
              // console.log(result.data)
              response.data.forEach(function (each) {
                _self.contributors.push(each)
              })
            })
            axios.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/readme').then(function (response) {
              _self.readme = _self.content = decodeURIComponent(atob(response.data.content).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
              }).join(''))
            })
            axios.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/collaborators').then(function (response) {
              _self.collaborators = response.data
            })
            axios.get('/user/starred/' + _self.repositoryOwner + '/' + _self.repositoryName).then(function (response) {
              if (response.status === 204) {
                _self.viewerHasStarred = true
              } else {
                _self.viewerHasStarred = false
              }
            }).catch(function (error) {
              _self.viewerHasStarred = false
              throw error
            })
            axios.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/issues', {
              params: {
                subscribed: true,
                ignored: false
              }
            }).then(function (response) {
              _self.issues = response.data
            }).catch(function (error) {
              throw error
            })
            axios.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/subscription').then(function (response) {
              if (response.status === 200) {
                if (response.data.subscribed) {
                  _self.viewerIsWatching = true
                }
              } else {
                _self.viewerIsWatching = false
              }
            }).catch(function (error) {
              _self.viewerIsWatching = false
              throw error
            })
            axios.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/pulls').then(function (response) {
              _self.pullRequests = response.data
            }).catch(function (error) {
              throw error
            })
            axios.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/contents').then(function (response) {
              response.data.forEach(function (each) {
                _self.contents.push(each)
              })
            }).catch(function (error) {
              throw error
            })
          }
        }
      }
    },
    methods: {
      starLogic: function () {
        var _self = this
        if (_self.isStarred) {
          axios.delete('/user/starred/' + _self.repositoryOwner + '/' + _self.repositoryName).then(function (response) {
            if (response.status === 204) {
              _self.starred = false
              _self.successMessage = 'Repository is no longer starred.'
              _self.success = true
              setTimeout(function () {
                _self.success = false
              }, 5000)
            }
          }).catch(function (error) {
            throw error
          })
        } else {
          axios.put('/user/starred/' + _self.repositoryOwner + '/' + _self.repositoryName).then(function (response) {
            if (response.status === 204) {
              _self.starred = true
              _self.successMessage = 'Repository was starred.'
              _self.success = true
              setTimeout(function () {
                _self.success = false
              }, 5000)
            }
          }).catch(function (error) {
            _self.errorMessage = 'Something went wrong when starring the repository.'
            _self.error = true
            setTimeout(function () {
              _self.error = false
            }, 5000)
            throw error
          })
        }
      },
      forkLogic: function () {
        var _self = this

        axios.post('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/forks').then(response => {
          if (response.status === 202) {
            _self.viewerHasForked = true
            _self.successMessage = 'Repository was forked, you\'ll be redirected in 5s.'
            _self.success = true
            setTimeout(function () {
              _self.success = false
              // _self.$router.push('/repos')
            }, 5000)
          }
        }).catch(error => {
          _self.errorMessage = 'Something went wrong when forking the repository.'
          _self.error = true
          setTimeout(function () {
            _self.error = false
          }, 5000)
          throw error
        })
      },
      watchLogic: function () {
        var _self = this
        if (!_self.isWatched) {
          axios.put('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/subscription', {
            params: {
              subscribed: true,
              ignored: false
            }
          }).then(response => {
            console.log(response.status)
            if (response.status === 200) {
              _self.watched = true
              _self.successMessage = 'Repository is being watched.'
              _self.success = true
              setTimeout(function () {
                _self.success = false
              }, 5000)
            }
          }).catch(function (error) {
            _self.errorMessage = 'Something went wrong when watching the repository.'
            _self.error = true
            setTimeout(function () {
              _self.error = false
            }, 5000)
            throw error
          })
        } else {
          axios.delete('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/subscription').then(response => {
            if (response.status === 204) {
              _self.watched = false
              _self.successMessage = 'Repository is no longer being watched.'
              _self.success = true
              setTimeout(function () {
                _self.success = false
              }, 5000)
            }
          }).catch(function (error) {
            throw error
          })
        }
      },
      goToUploadFile: function () {
        this.$router.push({
          name: 'CreateFile',
          params: {
            owner: this.repositoryOwner,
            repo: this.repositoryName
          }
        })
      },
      getWiki: function () {
        let _self = this
        console.log('wiki')
        axios.get(`/repos/${_self.repositoryOwner}/${_self.repositoryName}/wiki`).then(function (response) {
          console.log(response.data)
        })
      },
      saveRepo: function () {
        var _self = this
        console.log('Saving...')
        const channel = new BroadcastChannel('pwa_channel')
        channel.postMessage({owner: _self.repositoryOwner, name: _self.repositoryName})

        const idb = indexedDB.open('saved-repos', 1)
        idb.onsuccess = function () {
          // new tx
          var db = idb.result
          var tx = db.transaction('saved-repos', 'readwrite')
          console.log('new transaction is ', tx)

          if (navigator.storage && navigator.storage.persist) {
            navigator.storage.persist().then(granted => {
              if (granted) {
                var _tx = db.transaction('saved-repos', 'readwrite')
                var store = _tx.objectStore('saved-repos')
                store.index('url')
                console.log('new transaction is ', _tx)
                store.put({url: '/gh/' + _self.repositoryOwner + '/' + _self.repositoryName, content: _self.repoGH})
                store.put({url: '/repos/' + _self.repositoryOwner + '/' + _self.repositoryName, content: _self.repo})
                store.put({
                  url: '/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/commits',
                  content: _self.commits
                })
                store.put({
                  url: '/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/contributors',
                  content: _self.contributors
                })
                store.put({
                  url: '/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/readme',
                  content: _self.readme
                })
                store.put({
                  url: '/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/collaborators',
                  content: _self.collaborators
                })
                store.put({
                  url: '/user/starred/' + _self.repositoryOwner + '/' + _self.repositoryName,
                  content: _self.viewerHasStarred
                })
                store.put({
                  url: '/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/issues',
                  content: _self.issues
                })
                store.put({
                  url: '/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/subscription',
                  content: _self.viewerIsWatching
                })
                store.put({
                  url: '/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/pulls',
                  content: _self.pullRequests
                })
                store.put({
                  url: '/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/contents',
                  content: _self.contents
                })
                _self.saveFiles('')
              } else {
                _self.warningMessage = 'Storage may be cleared by the UA under storage pressure.'
                _self.warning = true
                setTimeout(function () {
                  _self.warning = false
                }, 5000)
              }
            })
          }
          tx.oncomplete = function () {
            _self.successMessage = 'Repository saved.'
            _self.success = true
            setTimeout(function () {
              _self.success = false
            }, 5000)
            db.close()
          }

          tx.onerror = function () {
            _self.errorMessage = 'Something went wrong when saving the repository.'
            _self.error = true
            setTimeout(function () {
              _self.error = false
            }, 5000)
          }
        }
      },
      saveFiles: function (path) {
        var _self = this
        const idb = indexedDB.open('saved-repos', 1)
        idb.onsuccess = function () {
          // new tx
          var db = idb.result

          axios.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/contents/' + path).then(function (response) {
            var tx = db.transaction('saved-repos', 'readwrite')
            var store = tx.objectStore('saved-repos')
            store.index('url')
            store.put({
              url: '/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/contents/' + path,
              content: response.data
            })
            response.data.forEach(function (each) {
              if (each.type === 'file') {
                axios.get('/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/contents/' + each.path).then(function (response) {
                  var tx = db.transaction('saved-repos', 'readwrite')
                  var store = tx.objectStore('saved-repos')
                  store.index('url')
                  store.put({
                    url: '/repos/' + _self.repositoryOwner + '/' + _self.repositoryName + '/contents/' + each.path,
                    content: response.data
                  })
                })
              } else {
                _self.saveFiles(each.path)
              }
            })
          })
        }
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

  .material-icons
    font-size: 40px

  .custom-alert
    position: absolute
    top: 14%
    left: 50%
    right: 5%
    z-index: 999
</style>
