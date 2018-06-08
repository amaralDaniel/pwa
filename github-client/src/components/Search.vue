<template>
    <div id="search-component">
      <v-container grid-list-xl text-xs-center fluid>
        <v-layout row wrap>
          <v-container>
            <v-layout row justify-center>
              <v-flex>
                <v-text-field v-model="searchString" color="secondary" id="search-input-field"></v-text-field>
              </v-flex>
              <v-flex align-baseline>
                <v-btn icon v-on:click="doSearch" id="execute-search-button">
                  <v-icon>search</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
          <v-flex xs12 >
            <v-expansion-panel focusable popout>
              <v-expansion-panel-content id="repositories-search-filter" >
                <div slot="header" class="body-2">Repositories</div>
                <v-card>
                  <v-card-text class="grey lighten-3">
                    <li v-for="repo in fetchedRepositoriesResult">
                      <router-link v-if="repo.viewerPermission === 'WRITE'" :to="{name: 'knownRepo', params: { owner: repo.owner.login, name: repo.name }}">
                        <v-card ripple tile append replace class="my-2">
                          <v-card-title primary-title>
                            <div >
                              {{repo.viewerPermission}}
                              <p class="headline text-sm-left">{{repo.full_name}}</p>
                              <p class="body-2 grey--text text-sm-left">Created <span class="body-1">{{ repo.created_at | moment("from") }}</span></p>
                              <p class="body-2 grey--text text-sm-left">Forks: <span class="body-1">{{repo.forks_count}}</span></p>
                              <p class="body-2 grey--text text-sm-left">Watchers: <span class="body-1">{{repo.watchers_count}}</span></p>
                              <p class="body-2 grey--text text-sm-left">Disk Usage: <span class="body-1">{{repo.size}} kb</span></p>
                            </div>
                          </v-card-title>
                          <v-card-text>
                            <div>
                              <p class="" v-if="repo.description">{{repo.description}}</p>
                            </div>
                          </v-card-text>
                          <v-card-actions>
                            <v-btn flat>Fork</v-btn>
                            <!--<v-btn flat color="purple">Explore</v-btn>-->
                            <v-spacer></v-spacer>
                          </v-card-actions>
                        </v-card>
                      </router-link>
                      <router-link v-else-if="repo.viewerPermission === 'ADMIN'" :to="{name: 'knownRepo', params: { owner: repo.owner.login, name: repo.name }}">
                        <v-card ripple tile append replace class="my-2">
                          <v-card-title primary-title>
                            <div >
                              {{repo.viewerPermission}}
                              <p class="headline text-sm-left">{{repo.full_name}}</p>
                              <p class="body-2 grey--text text-sm-left">Created <span class="body-1">{{ repo.created_at | moment("from") }}</span></p>
                              <p class="body-2 grey--text text-sm-left">Forks: <span class="body-1">{{repo.forks_count}}</span></p>
                              <p class="body-2 grey--text text-sm-left">Watchers: <span class="body-1">{{repo.watchers_count}}</span></p>
                              <p class="body-2 grey--text text-sm-left">Disk Usage: <span class="body-1">{{repo.size}} kb</span></p>
                            </div>
                          </v-card-title>
                          <v-card-text>
                            <div>
                              <p class="" v-if="repo.description">{{repo.description}}</p>
                            </div>
                          </v-card-text>
                          <v-card-actions>
                            <v-btn flat>Fork</v-btn>
                            <!--<v-btn flat color="purple">Explore</v-btn>-->
                            <v-spacer></v-spacer>
                          </v-card-actions>
                        </v-card>
                      </router-link>
                      <router-link v-else :to="{name: 'visitedRepo', params: { owner: repo.owner.login, name: repo.name }}">
                        <v-card ripple tile append replace class="my-2">
                          <v-card-title primary-title>
                            <div >
                              {{repo.viewerPermission}}
                              <p class="headline text-sm-left">{{repo.full_name}}</p>
                              <p class="body-2 grey--text text-sm-left">Created <span class="body-1">{{ repo.created_at | moment("from") }}</span></p>
                              <p class="body-2 grey--text text-sm-left">Forks: <span class="body-1">{{repo.forks_count}}</span></p>
                              <p class="body-2 grey--text text-sm-left">Watchers: <span class="body-1">{{repo.watchers_count}}</span></p>
                              <p class="body-2 grey--text text-sm-left">Disk Usage: <span class="body-1">{{repo.size}} kb</span></p>
                            </div>
                          </v-card-title>
                          <v-card-text>
                            <div>
                              <p class="" v-if="repo.description">{{repo.description}}</p>
                            </div>
                          </v-card-text>
                          <v-card-actions>
                            <v-btn flat>Fork</v-btn>
                            <!--<v-btn flat color="purple">Explore</v-btn>-->
                            <v-spacer></v-spacer>
                          </v-card-actions>
                        </v-card>
                      </router-link>
                    </li>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
              <v-expansion-panel-content id="users-search-filter">
                <div slot="header" class="body-2">Users</div>
                <v-card>
                  <v-card-text class="grey lighten-3">
                    <li v-for="user in fetchedUsersResult">
                      <router-link :to="{name: 'User', params: { login: user.login}}">
                        <v-card ripple tile append replace class="my-2">
                          <v-container fluid align-content-start>
                            <v-layout row wrap>
                              <v-avatar>
                                <img :src="user.avatar_url" :alt="user.login">
                              </v-avatar>
                              <v-spacer></v-spacer>
                              <v-card-title class="body-2">{{user.login}}</v-card-title>
                            </v-layout>
                          </v-container>
                        </v-card>
                      </router-link>
                    </li>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
              <v-expansion-panel-content id="code-search-filter">
                <div slot="header" class="body-2">Code</div>
                <v-card>
                  <v-card-text class="grey lighten-3">
                    <li v-for="code in fetchedCodeResult">
                      <router-link :to="{name: 'singleFile', params: { sha: code.sha }}">
                        <v-card ripple tile append replace class="my-2">
                          <v-card-title primary-title>
                            <div >
                              <p class="headline text-sm-left">{{code.name}}</p>
                              <p class="grey--text text-sm-left">{{code.repository.owner.login}}/{{code.repository.full_name}}</p>
                            </div>
                          </v-card-title>
                        </v-card>
                      </router-link>
                    </li>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
              <v-expansion-panel-content id="issues-search-filter">
                <div slot="header" class="body-2">Issues</div>
                <v-card>
                  <v-card-text class="grey lighten-3">
                    <li v-for="issue in fetchedIssuesResult">
                      <router-link :to="{name: 'singleIssue', params: { owner: issue.user.login, name: issue.id }}">
                        <v-card ripple tile append replace class="my-2">
                          <v-card-title primary-title>
                            <div >
                              <p class="headline text-sm-left">{{issue.title}}</p>
                              <p class="grey--text text-sm-left">Created {{ issue.created_at | moment("from") }}</p>
                              <p class="grey--text text-sm-left" v-if="issue.updated_at">Last edited {{ issue.updated_at | moment("from") }}</p>
                              <p class="grey--text text-sm-left">#{{issue.number}}</p>
                              <p class="text-sm-left green--text" v-if="issue.state === 'open' ">Open</p>
                              <p class="text-sm-left red--text" v-else>Closed {{ issue.closedAt | moment("from") }}</p>

                            </div>
                          </v-card-title>
                          <v-card-actions>
                            <v-btn flat>Subscribe</v-btn>
                            <!--<v-btn flat color="purple">Explore</v-btn>-->
                            <v-spacer></v-spacer>
                          </v-card-actions>
                        </v-card>
                      </router-link>
                    </li>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-flex>
        </v-layout>
        </v-container>
    </div>

</template>

<script>
  import axios from 'axios'
  export default {
    name: 'search',
    data () {
      return {
        searchString: '',
        repositoriesResult: null,
        usersResult: null,
        codeResult: null,
        issuesResult: null,
        selectedSearch: ''
      }
    },
    methods: {
      doSearch () {
        var _self = this
        axios.get('/search/repositories', {
          params: {
            q: _self.searchString
          }
        })
          .then(({data: repositories}) => {
            _self.repositoriesResult = repositories.items
          }).catch((error) => {
            console.log('forRepositories error:', error)
          })

        axios.get('/search/users', {
          params: {
            q: _self.searchString
          }
        })
          .then(({data: users}) => {
            _self.usersResult = users.items
          }).catch((error) => {
            console.log('forUsers error:', error)
          })

        axios.get('/search/code', {
          params: {
            q: _self.searchString
          }
        })
          .then(({data: code}) => {
            _self.codeResult = code.items
          }).catch((error) => {
            console.log('forCode error:', error)
          })

        axios.get('/search/issues', {
          params: {
            q: _self.searchString
          }
        })
          .then(({data: issues}) => {
            _self.issuesResult = issues.items
          }).catch((error) => {
            console.log('forIssues error:', error)
          })
      }
    },
    computed: {
      fetchedUsersResult: function () {
        return this.usersResult
      },
      fetchedRepositoriesResult: function () {
        return this.repositoriesResult
      },
      fetchedCodeResult: function () {
        return this.codeResult
      },
      fetchedIssuesResult: function () {
        var _self = this
        if (this.issuesResult) {
          return _self.issuesResult.slice(0, 100)
        }
      }
    }
  }
</script>

<style scoped>

</style>
