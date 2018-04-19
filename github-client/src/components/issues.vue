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
        <v-container
          fluid
          style="min-height: 0; position: relative;"
          grid-list-lg
        >
          <v-layout row wrap>
            <v-flex xs12>
              <div v-if="item === 'Created'" class="issue-outer">
                <v-switch
                  label="Open"
                  v-model="createdSwitch"
                ></v-switch>
                <ul v-if="createdSwitch">
                  <v-card v-if="created.length === 0">
                    <v-card-title primary-title>
                      <p class="headline text-md-center">Nothing to show here</p>
                    </v-card-title>
                  </v-card>
                  <li v-for="issue in created">
                    <router-link :to="{name: 'singleIssue', params: { owner: issue.repository.owner.login, repo: issue.repository.name, number: issue.number }}">
                      <v-card ripple tile append replace class="my-2" text-md-left>
                        <v-card-title primary-title>
                          <div >
                            <p class="headline text-sm-left">{{issue.title}} <span class="body-2 grey--text">on {{issue.repository.full_name}}</span></p>
                            <p class="body-2 grey--text text-sm-left">Created <span class="body-1">{{ issue.created_at | moment("from") }}</span> by <span class="body-1">{{issue.user.login}}</span></p>
                            <p class="body-2 grey--text text-sm-left">Last updated <span class="body-1">{{ issue.updated_at | moment("from") }}</span></p>
                            <p class="body-2 grey--text text-sm-left">Comments: <span class="body-1">{{ issue.comments }}</span></p>
                          </div>
                        </v-card-title>
                      </v-card>
                    </router-link>
                  </li>
                </ul>
                <ul v-else>
                  <v-card v-if="createdClosed.length === 0">
                    <v-card-title primary-title>
                      <p class="headline text-md-center">Nothing to show here</p>
                    </v-card-title>
                  </v-card>
                  <li v-for="issue in createdClosed">
                    <router-link :to="{name: 'singleIssue', params: { owner: issue.repository.owner.login, repo: issue.repository.name, number: issue.number }}">
                      <v-card ripple tile append replace class="my-2" text-md-left>
                        <v-card-title primary-title>
                          <div >
                            <p class="headline text-sm-left">{{issue.title}} <span class="body-2 grey--text">on {{issue.repository.full_name}}</span></p>
                            <p class="body-2 grey--text text-sm-left">Created <span class="body-1">{{ issue.created_at | moment("from") }}</span> by <span class="body-1">{{issue.user.login}}</span></p>
                            <p class="body-2 grey--text text-sm-left">Last updated <span class="body-1">{{ issue.updated_at | moment("from") }}</span></p>
                            <p class="body-2 grey--text text-sm-left">Comments: <span class="body-1">{{ issue.comments }}</span></p>
                          </div>
                        </v-card-title>
                      </v-card>
                    </router-link>
                  </li>
                </ul>
              </div>
              <div v-if="item === 'Watched'" class="issue-outer">
                <v-switch
                  label="Open"
                  v-model="watchedSwitch"
                ></v-switch>
                <ul v-if="watchedSwitch">
                  <v-card v-if="watched.length === 0">
                    <v-card-title primary-title>
                      <p class="headline text-md-center">Nothing to show here</p>
                    </v-card-title>
                  </v-card>
                  <li v-for="issue in watched">
                    <router-link :to="{name: 'singleIssue', params: { owner: issue.repository.owner.login, repo: issue.repository.name, number: issue.number }}">
                      <v-card ripple tile append replace class="my-2" text-md-left>
                        <v-card-title primary-title>
                          <div >
                            <p class="headline text-sm-left">{{issue.title}} <span class="body-2 grey--text">on {{issue.repository.full_name}}</span></p>
                            <p class="body-2 grey--text text-sm-left">Created <span class="body-1">{{ issue.created_at | moment("from") }}</span> by <span class="body-1">{{issue.user.login}}</span></p>
                            <p class="body-2 grey--text text-sm-left">Last updated <span class="body-1">{{ issue.updated_at | moment("from") }}</span></p>
                            <p class="body-2 grey--text text-sm-left">Comments: <span class="body-1">{{ issue.comments }}</span></p>
                          </div>
                        </v-card-title>
                      </v-card>
                    </router-link>
                  </li>
                </ul>
                <ul v-else>
                  <v-card v-if="watchedClosed.length === 0">
                    <v-card-title primary-title>
                      <p class="headline text-md-center">Nothing to show here</p>
                    </v-card-title>
                  </v-card>
                  <li v-for="issue in watchedClosed">
                    <router-link :to="{name: 'singleIssue', params: { owner: issue.repository.owner.login, repo: issue.repository.name, number: issue.number }}">
                      <v-card ripple tile append replace class="my-2" text-md-left>
                        <v-card-title primary-title>
                          <div >
                            <p class="headline text-sm-left">{{issue.title}} <span class="body-2 grey--text">on {{issue.repository.full_name}}</span></p>
                            <p class="body-2 grey--text text-sm-left">Created <span class="body-1">{{ issue.created_at | moment("from") }}</span> by <span class="body-1">{{issue.user.login}}</span></p>
                            <p class="body-2 grey--text text-sm-left">Last updated <span class="body-1">{{ issue.updated_at | moment("from") }}</span></p>
                            <p class="body-2 grey--text text-sm-left">Comments: <span class="body-1">{{ issue.comments }}</span></p>
                          </div>
                        </v-card-title>
                      </v-card>
                    </router-link>
                  </li>
                </ul>
              </div>
              <div v-if="item === 'Assigned'" class="issue-outer">
                <v-switch
                  label="Open"
                  v-model="assignedSwitch"
                ></v-switch>
                <ul v-if="assignedSwitch">
                  <v-card v-if="assigned.length === 0">
                    <v-card-title primary-title>
                      <p class="headline text-md-center">Nothing to show here</p>
                    </v-card-title>
                  </v-card>
                  <li v-for="issue in assigned">
                    <router-link :to="{name: 'singleIssue', params: { owner: issue.repository.owner.login, repo: issue.repository.name, number: issue.number }}">
                      <v-card ripple tile append replace class="my-2" text-md-left>
                        <v-card-title primary-title>
                          <div >
                            <p class="headline text-sm-left">{{issue.title}} <span class="body-2 grey--text">on {{issue.repository.full_name}}</span></p>
                            <p class="body-2 grey--text text-sm-left">Created <span class="body-1">{{ issue.created_at | moment("from") }}</span> by <span class="body-1">{{issue.user.login}}</span></p>
                            <p class="body-2 grey--text text-sm-left">Last updated <span class="body-1">{{ issue.updated_at | moment("from") }}</span></p>
                            <p class="body-2 grey--text text-sm-left">Comments: <span class="body-1">{{ issue.comments }}</span></p>
                          </div>
                        </v-card-title>
                      </v-card>
                    </router-link>
                  </li>
                </ul>
                <ul v-else>
                  <li v-for="issue in assignedClosed">
                    <v-card v-if="assignedClosed.length === 0">
                      <v-card-title primary-title>
                        <p class="headline text-md-center">Nothing to show here</p>
                      </v-card-title>
                    </v-card>
                    <router-link :to="{name: 'singleIssue', params: { owner: issue.repository.owner.login, repo: issue.repository.name, number: issue.number }}">
                      <v-card ripple tile append replace class="my-2" text-md-left>
                        <v-card-title primary-title>
                          <div >
                            <p class="headline text-sm-left">{{issue.title}} <span class="body-2 grey--text">on {{issue.repository.full_name}}</span></p>
                            <p class="body-2 grey--text text-sm-left">Created <span class="body-1">{{ issue.created_at | moment("from") }}</span> by <span class="body-1">{{issue.user.login}}</span></p>
                            <p class="body-2 grey--text text-sm-left">Last updated <span class="body-1">{{ issue.updated_at | moment("from") }}</span></p>
                            <p class="body-2 grey--text text-sm-left">Comments: <span class="body-1">{{ issue.comments }}</span></p>
                          </div>
                        </v-card-title>
                      </v-card>
                    </router-link>
                  </li>
                </ul>
              </div>
              <div v-if="item === 'Mentioned'" class="issue-outer">
                <v-switch
                  label="Open"
                  v-model="mentionedSwitch"
                ></v-switch>
                <ul v-if="mentionedSwitch">
                  <v-card v-if="mentioned.length === 0">
                    <v-card-title primary-title>
                      <p class="headline text-md-center">Nothing to show here</p>
                    </v-card-title>
                  </v-card>
                  <li v-for="issue in mentioned">
                    <router-link :to="{name: 'singleIssue', params: { owner: issue.repository.owner.login, repo: issue.repository.name, number: issue.number }}">
                      <v-card ripple tile append replace class="my-2" text-md-left>
                        <v-card-title primary-title>
                          <div >
                            <p class="headline text-sm-left">{{issue.title}} <span class="body-2 grey--text">on {{issue.repository.full_name}}</span></p>
                            <p class="body-2 grey--text text-sm-left">Created <span class="body-1">{{ issue.created_at | moment("from") }}</span> by <span class="body-1">{{issue.user.login}}</span></p>
                            <p class="body-2 grey--text text-sm-left">Last updated <span class="body-1">{{ issue.updated_at | moment("from") }}</span></p>
                            <p class="body-2 grey--text text-sm-left">Comments: <span class="body-1">{{ issue.comments }}</span></p>
                          </div>
                        </v-card-title>
                      </v-card>
                    </router-link>
                  </li>
                </ul>
                <ul v-else>
                  <v-card v-if="mentionedClosed.length === 0">
                    <v-card-title primary-title>
                      <p class="headline text-md-center">Nothing to show here</p>
                    </v-card-title>
                  </v-card>
                  <li v-for="issue in mentionedClosed">
                    <router-link :to="{name: 'singleIssue', params: { owner: issue.repository.owner.login, repo: issue.repository.name, number: issue.number }}">
                      <v-card ripple tile append replace class="my-2" text-md-left>
                        <v-card-title primary-title>
                          <div >
                            <p class="headline text-sm-left">{{issue.title}} <span class="body-2 grey--text">on {{issue.repository.full_name}}</span></p>
                            <p class="body-2 grey--text text-sm-left">Created <span class="body-1">{{ issue.created_at | moment("from") }}</span> by <span class="body-1">{{issue.user.login}}</span></p>
                            <p class="body-2 grey--text text-sm-left">Last updated <span class="body-1">{{ issue.updated_at | moment("from") }}</span></p>
                            <p class="body-2 grey--text text-sm-left">Comments: <span class="body-1">{{ issue.comments }}</span></p>
                          </div>
                        </v-card-title>
                      </v-card>
                    </router-link>
                  </li>
                </ul>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
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
        createdClosed: [],
        assigned: [],
        assignedClosed: [],
        watched: [],
        watchedClosed: [],
        mentioned: [],
        mentionedClosed: [],
        currentItem: 'Created',
        tabItems: ['Created', 'Watched', 'Assigned', 'Mentioned'],
        createdSwitch: true,
        assignedSwitch: true,
        watchedSwitch: true,
        mentionedSwitch: true
      }
    },
    mounted () {
      var _self = this
      _self.axiosInstance.get('/issues', {
        params: {
          filter: 'created',
          state: 'all'
        }
      }).then(function (response) {
        // console.log(response.data)
        response.data.forEach(function (each) {
          if (each.state === 'closed') {
            _self.createdClosed.push(each)
          } else {
            _self.created.push(each)
          }
        })
      })
      _self.axiosInstance.get('/issues', {
        params: {
          filter: 'subscribed',
          state: 'all'
        }
      }).then(function (response) {
        // console.log(response.data)
        response.data.forEach(function (each) {
          if (each.state === 'closed') {
            _self.watchedClosed.push(each)
          } else {
            _self.watched.push(each)
          }
        })
      })
      _self.axiosInstance.get('/issues', {
        params: {
          filter: 'assigned',
          state: 'all'
        }
      }).then(function (response) {
        // console.log(response.data)
        response.data.forEach(function (each) {
          if (each.state === 'closed') {
            _self.assignedClosed.push(each)
          } else {
            _self.assigned.push(each)
          }
        })
      })
      _self.axiosInstance.get('/issues', {
        params: {
          filter: 'mentioned',
          state: 'all'
        }
      }).then(function (response) {
        // console.log(response.data)
        response.data.forEach(function (each) {
          if (each.state === 'closed') {
            _self.mentionedClosed.push(each)
          } else {
            _self.mentioned.push(each)
          }
        })
      })
    }
  }
</script>

<style lang="sass" scoped>

  .card-item
    min-height: 15vh

  .issue-outer
    width: 100%
</style>
