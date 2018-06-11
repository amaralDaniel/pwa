<template>
  <v-container text-xs-left class="mt-5">
    <v-alert type="error" class="alert custom-alert" :value="error">
      {{errorMessage}}
    </v-alert>
    <v-alert type="success" class="alert custom-alert" :value="success">
      {{successMessage}}
    </v-alert>
    <div>
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.name" label="Cache name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.space" label="Used space"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-data-table
        :headers="headers"
        :items="repos"
        hide-actions
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
          <td class="text-xs-left">{{ props.item.space }}</td>
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="deleteItem(props.item)">
              <v-icon color="pink">delete</v-icon>
            </v-btn>
          </td>
        </template>
        <template slot="no-data">
          <span>Nothing to show here.</span>
        </template>
      </v-data-table>
    </div>
  </v-container>
</template>

<script>
  export default {
    name: 'StorageManagement',
    data: () => ({
      dialog: false,
      headers: [
        {
          text: 'Repositories',
          align: 'left',
          sortable: true,
          value: 'name'
        },
        { text: 'Used Space (kb)', value: 'space' }
      ],
      caches: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        space: 0
      },
      defaultItem: {
        name: '',
        space: 0
      },
      error: false,
      errorMessage: '',
      success: false,
      successMessage: ''
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
      repos () {
        return this.caches
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    created () {
      this.initialize()
    },

    methods: {

      initialize () {
        var _self = this
        var idb = window.indexedDB.open('saved-repos', 1)

        idb.onsuccess = function (e) {
          var db = idb.result
          var tx = db.transaction('saved-repos', 'readwrite')
          var store = tx.objectStore('saved-repos')

          var regex = /^\/repos\/([aA-zZ\d])+\/([aA-zZ\d])+$/gm
          store.openCursor().onsuccess = function (ev) {
            var cursor = ev.target.result
            if (cursor) {
              var found = cursor.key.match(regex)
              if (found) {
                _self.caches.push({
                  name: cursor.value.content.full_name,
                  space: cursor.value.content.size
                })
              }
              cursor.continue()
            }
          }
        }
      },

      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        console.log(item)
        confirm('Are you sure you want to delete ' + item.name + ' ?') && this.doWipeout(item.name)
      },

      doWipeout (name) {
        var _self = this
        var dbV = 1
        var idb = indexedDB.open('saved-repos', dbV)

        idb.onsuccess = function (e) {
          var db = idb.result
          var tx = db.transaction('saved-repos', 'readwrite')
          var store = tx.objectStore('saved-repos')

          store.openCursor().onsuccess = function (ev) {
            var cursor = ev.target.result
            if (cursor) {
              var found = cursor.key.match(name)
              if (found) {
                store.delete(cursor.key)
              }
              cursor.continue()
            }
          }
          _self.caches.forEach(function callback (cache, index) {
            console.log(cache)
            if (cache.name === name) {
              return _self.caches.splice(index, 1)
            }
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
