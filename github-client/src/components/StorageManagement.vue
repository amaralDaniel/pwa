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
                  <v-text-field v-model="editedItem.space" label="Usage (%)"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-data-table
        :headers="headers"
        :items="caches"
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
          text: 'Cache Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Used Space', value: 'space' }
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
        navigator.storage.estimate().then(function (estimate) {
          _self.caches = [
            {
              name: 'Cache',
              space: (estimate.usage / estimate.quota).toFixed(3) + ' %'
            }
          ]
        })
      },

      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        confirm('Are you sure you want to delete this item?') && this.doWipeout()
      },

      doWipeout () {
        console.log('yo')
        var _self = this
        var dbV = 2
        var idb = indexedDB.open('saved-repos', dbV)
        console.log('idb ', idb)
        idb.onupgradeneeded = function (e) {
          var db = idb.result
          if (e.oldVersion < 2) {
            console.log('version 2')
            db.deleteObjectStore('saved-repos')
            console.log('delete')
            caches.delete('pwa-client').then(function (boolean) {
              if (boolean) {
                _self.successMessage = 'Storage was deleted.'
                _self.success = true
                setTimeout(function () {
                  _self.success = false
                }, 5000)
                db.close()
              } else {
                _self.errorMessage = 'Something went wrong when deleting the cache.'
                _self.error = true
                setTimeout(function () {
                  _self.error = false
                }, 5000)
              }
            })
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
