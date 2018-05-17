<template>
  <v-container grid-list-md class="mt-5" >
    <v-layout row wrap>
      <v-avatar
        :size="150"
        class="grey lighten-4 "
      >
        <img :src="user.avatar_url" alt="avatar">
      </v-avatar>
      <v-layout column class="ml-5">
        <v-flex xs12 sm2 class="text-sm-left">
          <span class="headline">{{user.login}}</span>
          <br>
          <span class="body-2" v-if="user.location">{{user.location}}</span>
          <span v-else class="grey--text">n/a</span>
          <v-btn v-if="canFollow" round color="primary" dark :outline="!isFollowing" v-on:click="followLogic">Following</v-btn>
        </v-flex>
      </v-layout>
      <v-expansion-panel focusable class="mt-4">
        <v-expansion-panel-content >
          <div slot="header" class="body-2">Profile info</div>
          <v-card>
            <v-container fluid>
              <v-layout row>
                <v-flex xs4>
                  <v-subheader>Name</v-subheader>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-card-text class="">{{user.name}}</v-card-text>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs4>
                  <v-subheader>Location</v-subheader>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-card-text v-if="user.location">{{user.location}} </v-card-text>
                  <v-card-text v-else>n/a </v-card-text>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs4>
                  <v-subheader>Website</v-subheader>
                </v-flex>
                <!--<v-flex xs12 sm6>-->
                  <!--<v-card-text v-if="user.websiteUrl">{{user.websiteUrl}}</v-card-text>-->
                  <!--<v-card-text v-else>n/a</v-card-text>-->
                <!--</v-flex>-->
              </v-layout>
              <v-layout row>
                <v-flex xs4>
                  <v-subheader>Email Address</v-subheader>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-card-text v-if="user.email">
                    {{user.email}}
                  </v-card-text>
                  <v-card-text v-else>n/a</v-card-text>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs4>
                  <v-subheader>Bio</v-subheader>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-card-text v-if="user.bio">
                    {{user.bio}}
                  </v-card-text>
                  <v-card-text multiline v-else>n/a</v-card-text>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content >
          <div slot="header" class="body-2">Repositories</div>
          <v-card>
            <v-container>
              <li v-for="repo in repos">
                <router-link v-if="repo.viewerPermission === 'WRITE'" :to="{name: 'knownRepo', params: { owner: repo.owner.login , name: repo.name }}">
                  <v-card ripple tile append replace style="width: 75vh;" >
                    <v-card-title primary-title>
                      <v-layout row>
                        <v-flex xs4 sm6>
                          <p class="headline text-sm-left">{{repo.name}}</p>
                          <p class="body-2 grey--text text-sm-left">Created <span class="body-1">{{ repo.created_at | moment("from") }}</span></p>
                          <p class="body-2 grey--text text-sm-left">Forks: <span class="body-1">{{repo.forks_count}}</span></p>
                          <p class="body-2 grey--text text-sm-left">Stars: <span class="body-1">{{repo.stargazers_count}}</span></p>
                        </v-flex>
                      </v-layout>
                      <!--<ul class="text-sm-left">-->
                      <!--<li v-for="lang in repo.languages.nodes">-->
                      <!--<div class="text-xs-center">-->
                      <!--<v-chip v-bind:color="lang.color">{{lang.name}}</v-chip>-->
                      <!--</div>-->
                      <!--</li>-->
                      <!--</ul>-->
                    </v-card-title>
                  </v-card>
                </router-link>
                <router-link  v-else :to="{name: 'visitedRepo', params: { owner: repo.owner.login , name: repo.name }}">
                  <v-card ripple tile append replace style="width: 75vh;" >
                    <v-card-title primary-title>
                      <v-layout row>
                        <v-flex xs4 sm6>
                          <p class="headline text-sm-left">{{repo.name}}</p>
                          <p class="body-2 grey--text text-sm-left">Created <span class="body-1">{{ repo.created_at | moment("from") }}</span></p>
                          <p class="body-2 grey--text text-sm-left">Forks: <span class="body-1">{{repo.forks_count}}</span></p>
                          <p class="body-2 grey--text text-sm-left">Stars: <span class="body-1">{{repo.stargazers_count}}</span></p>
                        </v-flex>
                      </v-layout>
                      <!--<ul class="text-sm-left">-->
                      <!--<li v-for="lang in repo.languages.nodes">-->
                      <!--<div class="text-xs-center">-->
                      <!--<v-chip v-bind:color="lang.color">{{lang.name}}</v-chip>-->
                      <!--</div>-->
                      <!--</li>-->
                      <!--</ul>-->
                    </v-card-title>
                  </v-card>
                </router-link>
              </li>
            </v-container>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content >
          <div slot="header" class="body-2">Gists</div>
          <v-card>
            <v-container>
              <li v-for="gist in gists">
                <router-link :to="{name: 'singleGist', params: {name: gist.name}}">
                  <v-card ripple tile append replace style="width: 75vh;">
                    <v-card-title primary-title>
                      <div >
                        <p class="headline text-sm-left">{{gist.description}}</p>
                        <p class="grey--text text-sm-left">Created {{ gist.created_at | moment("from") }}</p>
                        <p class="grey--text text-sm-left">Stargazers: {{gist.stargazers_count}}</p>
                      </div>
                    </v-card-title>
                    <v-card-actions>
                      <!--<v-btn flat>Fork</v-btn>-->
                      <!--&lt;!&ndash;<v-btn flat color="purple">Explore</v-btn>&ndash;&gt;-->
                      <!--<v-spacer></v-spacer>-->
                      <!--<v-btn flat>Star</v-btn>-->
                      <!--&lt;!&ndash;<v-btn flat color="purple">Explore</v-btn>&ndash;&gt;-->
                      <!--<v-spacer></v-spacer>-->
                    </v-card-actions>
                  </v-card>
                </router-link>
              </li>
            </v-container>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content >
          <div slot="header" class="body-2">Followers</div>
          <v-card>
            <v-container>
              <li v-for="user in followers">
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
            </v-container>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content >
          <div slot="header" class="body-2">Following</div>
          <v-card>
            <v-container>
              <li v-for="user in following">
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
            </v-container>
          </v-card>
        </v-expansion-panel-content>
        <v-expansion-panel-content >
          <div slot="header" class="body-2">Starred Repositories</div>
          <v-card>
            <v-container>
              <li v-for="starredRepo in starred">
                <router-link :to="{name: 'visitedRepo', params: { owner: starredRepo.owner.login , name: starredRepo.name }}">
                  <v-card ripple append replace style="width: 75vh;" >
                    <v-card-title primary-title>
                      <v-layout row>
                        <v-flex xs4 sm6>
                          <p class="headline text-sm-left">{{starredRepo.name}}</p>
                          <p class="body-2 grey--text text-sm-left">Created <span class="body-1">{{ starredRepo.created_at | moment("from") }}</span></p>
                          <p class="body-2 grey--text text-sm-left">Forks: <span class="body-1">{{starredRepo.forks_count}}</span></p>
                          <p class="body-2 grey--text text-sm-left">Stars: <span class="body-1">{{starredRepo.stargazers_count}}</span></p>
                        </v-flex>
                      </v-layout>
                      <!--<ul class="text-sm-left">-->
                      <!--<li v-for="lang in repo.languages.nodes">-->
                      <!--<div class="text-xs-center">-->
                      <!--<v-chip v-bind:color="lang.color">{{lang.name}}</v-chip>-->
                      <!--</div>-->
                      <!--</li>-->
                      <!--</ul>-->
                    </v-card-title>
                  </v-card>
                </router-link>
              </li>
            </v-container>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>

    </v-layout>
  </v-container>

</template>

<script>
  export default {
    name: 'user',
    data () {
      return {
        user: null,
        gh: null,
        following: null,
        viewer: this.$store.getters.getViewer,
        repos: null,
        followers: null,
        gists: null,
        starred: null
      }
    },
    beforeMount () {
      var _self = this
      _self.axiosInstance.get('/users/' + _self.$route.params.login).then(response => {
        _self.user = response.data
      }).catch(error => {
        throw error
      })
      _self.axiosInstance.get('/users/' + _self.$route.params.login + '/repos').then(response => {
        _self.repos = response.data
      }).catch(error => {
        throw error
      })
      _self.axiosInstance.get('/users/' + _self.$route.params.login + '/followers').then(response => {
        _self.followers = response.data
      }).catch(error => {
        throw error
      })
      _self.axiosInstance.get('/users/' + _self.$route.params.login + '/following').then(response => {
        _self.following = response.data
      }).catch(error => {
        throw error
      })
      _self.axiosInstance.get('/users/' + _self.$route.params.login + '/gists').then(response => {
        _self.gists = response.data
      }).catch(error => {
        throw error
      })
      _self.axiosInstance.get('/users/' + _self.$route.params.login + '/starred').then(response => {
        _self.starred = response.data
      }).catch(error => {
        throw error
      })
    },
    methods: {
      followLogic: function () {
        var _self = this
        console.log('TOKEN', _self.$store.getters.getToken)
        if (!_self.following) {
          _self.axiosInstance.put('/user/following/' + _self.user.login).then(function (data) {
            console.log('start following')
            _self.following = true
          })
        } else {
          _self.axiosInstance.delete('/user/following/' + _self.user.login).then(function (data) {
            _self.following = false
          })
        }
      }
    },
    computed: {
      isFollowing: function () {
        var _self = this
        _self.axiosInstance.get('/users/' + _self.viewer.login + '/following/' + _self.user.login).then(function (response) {
          if (response.status === 204) {
            _self.following = true
          } else {
            _self.following = false
          }
        })
        if (_self.user) {
          if (_self.following) return true
          else return false
        }
      },
      canFollow: function () {
        return this.viewer.login !== this.user.login
      }
    }
  }
</script>

<style lang="sass" scoped>
  .following-btn
    outline: #0d47a1
</style>
