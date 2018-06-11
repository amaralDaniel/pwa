<template>
  <div
    id="e3"
    style="max-width: 85vh; margin: auto;"
    class=" lighten-3"
  >

    <v-container
      fluid
      style="min-height: 0; position: relative;"
      grid-list-lg
    >
      <v-layout row wrap>
        <v-flex xs12>
          <ul id="repos-list">
            <li v-for="notification in notifications">
                <v-card ripple tile append replace xs2 class="my-2">
                  <v-card-title primary-title class="text-xs-left" >
                    <v-layout row>
                      <v-flex xs12 sm12>
                        <span class="headline text-sm-left grey--text">{{notification.repository.full_name}}</span>
                        <p class="headline text-sm-left">{{notification.subject.title}}</p>
                        <p class="body-2 grey--text text-sm-left mt-2" v-if="!notification.unread">Read <span class="done-green"><i class="material-icons">done</i></span></p>
                        <p class="body-2 grey--text text-sm-left">Last updated <span class="body-1">{{ notification.updated_at | moment("from") }}</span></p>
                        <p class="body-2 grey--text text-sm-left" v-if="!notification.unread">Last read: <span class="body-1">{{notification.last_read_at | moment("from")}}</span></p>
                        <!--<ul class="text-sm-left">-->
                        <!--<li v-for="lang in repo.languages.nodes">-->
                        <!--<div class="text-xs-center">-->
                        <!--<v-chip v-bind:color="lang.color">{{lang.name}}</v-chip>-->
                        <!--</div>-->
                        <!--</li>-->
                        <!--</ul>-->
                      </v-flex>
                    </v-layout>
                  </v-card-title>
                  <v-card-text>
                    <div>
                      <p class="issue-type body-2 text-xs-left" v-if="notification.subject.type === 'Issue'">Issue</p>
                      <p class="pr-type body-2 text-xs-left" v-if="notification.subject.type === 'PullRequest'">Pull Request</p>

                    </div>
                  </v-card-text>
                  <!--<v-card-actions>
                    <v-btn flat>Fork</v-btn>
                    &lt;!&ndash;<v-btn flat color="purple">Explore</v-btn>&ndash;&gt;
                    <v-spacer></v-spacer>
                  </v-card-actions>-->
                </v-card>
            </li>
          </ul>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    name: 'Notifications',
    data () {
      return {
        notifications: []
      }
    },
    beforeMount () {
      var _self = this
      axios.get('/notifications', {
        params: {
          all: true
        }
      }).then(function (response) {
        _self.notifications = response.data
      })
    }
  }
</script>

<style lang="sass" scoped>
  @import '../styles/variables.scss'

  .issue-type
    border-style: solid
    border-width: 1px
    border-color: lightgrey
    padding: 2px 3px
    background-color: #0d47a1
    font-weight: bold
    color: white
    -webkit-border-radius: 1px
    -moz-border-radius: 1px
    border-radius: 1px
    width: fit-content

  .pr-type
    border-style: solid
    border-width: 1px
    border-color: lightgrey
    padding: 2px 3px
    background-color: #651fff
    font-weight: bold
    color: white
    -webkit-border-radius: 1px
    -moz-border-radius: 1px
    border-radius: 1px
    width: fit-content

  .done-green
    color: lawngreen
</style>
