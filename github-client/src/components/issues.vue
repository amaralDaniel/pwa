<template>
  <div>
    <v-tabs
      fixed-tabs
      v-model="currentItem"
      color="transparent"
      slider-color="secondary"
      slot="extension"
    >
      <v-tab
        v-for="item in tabItems"
        :key="item"
        :href="'#' + item"
      >
        {{ item }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="currentItem">
      <v-tab-item
        v-for="item in tabItems"
        :key="item"
        :id="item"
      >
        <v-card flat class="card-item">
          <v-card-text>
            <v-layout text-sm-left>
              <div v-if="item === 'Created'">
                <ul>
                  <li v-for="issue in created">
                    <router-link :to="{name: 'singleIssue', params: { owner: issue.user.login, repo: issue.repository.name, number: issue.number }}">
                      <v-card>
                        <v-layout row text-md-left>
                          <v-layout class="mb-2" column>
                            <router-link :to="{name: 'User', params: {login: issue.user.login}}">
                              <v-avatar>
                                <img :src="issue.user.avatar_url" alt="John">
                              </v-avatar>
                              <span class="body-2">{{issue.user.login}}</span>
                            </router-link>
                          </v-layout>
                          <div>{{issue.title}}</div>
                        </v-layout>
                      </v-card>
                    </router-link>
                  </li>
                </ul>
              </div>
              <div v-if="item === 'Watched'">
                <ul>
                  <li v-for="issue in watched">
                    <router-link :to="{name: 'singleIssue', params: { owner: issue.user.login, repo: issue.repository.name, number: issue.number }}">
                      <v-card>
                        <v-layout row text-md-left>
                          <v-layout class="mb-2" column>
                            <router-link :to="{name: 'User', params: {login: issue.user.login}}">
                              <v-avatar>
                                <img :src="issue.user.avatar_url" alt="John">
                              </v-avatar>
                              <span class="body-2">{{issue.user.login}}</span>
                            </router-link>
                          </v-layout>
                          <div>{{issue.title}}</div>
                        </v-layout>
                      </v-card>
                    </router-link>
                  </li>
                </ul>
              </div>
              <div v-if="item === 'Assigned'">
                <ul>
                  <li v-for="issue in assigned">
                    <router-link :to="{name: 'singleIssue', params: { owner: issue.user.login, repo: issue.repository.name, number: issue.number }}">
                      <v-card>
                        <v-layout row text-md-left>
                          <v-layout class="mb-2" column>
                            <router-link :to="{name: 'User', params: {login: issue.user.login}}">
                              <v-avatar>
                                <img :src="issue.user.avatar_url" alt="John">
                              </v-avatar>
                              <span class="body-2">{{issue.user.login}}</span>
                            </router-link>
                          </v-layout>
                          <div>{{issue.title}}</div>
                        </v-layout>
                      </v-card>
                    </router-link>
                  </li>
                </ul>
              </div>
              <div v-if="item === 'Mentioned'">
                <ul>
                  <li v-for="issue in mentioned">
                    <router-link :to="{name: 'singleIssue', params: { owner: issue.user.login, repo: issue.repository.name, number: issue.number }}">
                      <v-card>
                        <v-layout row text-md-left>
                          <v-layout class="mb-2" column>
                            <router-link :to="{name: 'User', params: {login: issue.user.login}}">
                              <v-avatar>
                                <img :src="issue.user.avatar_url" alt="John">
                              </v-avatar>
                              <span class="body-2">{{issue.user.login}}</span>
                            </router-link>
                          </v-layout>
                          <div>{{issue.title}}</div>
                        </v-layout>
                      </v-card>
                    </router-link>
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
  import Vue from 'vue'
  Vue.use(require('vue-moment'))
  export default {
    name: 'issues',
    data () {
      return {
        name: 'issues',
        created: [],
        assigned: [],
        watched: [],
        mentioned: [],
        currentItem: 'Created',
        tabItems: ['Created', 'Watched', 'Assigned', 'Mentioned']
      }
    },
    mounted () {
      var _self = this
      _self.axiosInstance.get('/user/issues', {
        params: {
          filter: 'created',
          state: 'all'
        }
      }).then(function (response) {
        console.log(response.data)
        response.data.forEach(function (each) {
          _self.created.push(each)
        })
      })
      _self.axiosInstance.get('/user/issues', {
        params: {
          filter: 'subscribed',
          state: 'all'
        }
      }).then(function (response) {
        console.log(response.data)
        response.data.forEach(function (each) {
          _self.watched.push(each)
        })
      })
      _self.axiosInstance.get('/user/issues', {
        params: {
          filter: 'assigned',
          state: 'all'
        }
      }).then(function (response) {
        console.log(response.data)
        response.data.forEach(function (each) {
          _self.assigned.push(each)
        })
      })
      _self.axiosInstance.get('/user/issues', {
        params: {
          filter: 'mentioned',
          state: 'all'
        }
      }).then(function (response) {
        console.log(response.data)
        response.data.forEach(function (each) {
          _self.mentioned.push(each)
        })
      })
    }
  }
</script>

<style lang="sass" scoped>

  .card-item
    min-height: 15vh
</style>
