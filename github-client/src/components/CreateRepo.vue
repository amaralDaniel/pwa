<template>
    <v-container  grid-list-md text-xs-center id="create-repo-container">
      <v-form v-model="valid" ref="form" lazy-validation>
        <v-alert type="error" class="alert custom-alert" :value="error">
          {{errorMessage}}
        </v-alert>
        <v-alert type="success custom-alert" :value="success">
          {{successMessage}}
        </v-alert>
        <v-layout row wrap>
          <v-flex xs4>
            <v-subheader class="subheading">Repository Name</v-subheader>
          </v-flex>
          <v-flex xs8 sm6>
            <v-text-field
              label="Repository name"
              v-model="name"
              :rules="nameRules"
              :counter="50"
              required
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs4>
            <v-subheader class="subheading">Description</v-subheader>
            <v-subheader>(Optional)</v-subheader>
          </v-flex>
          <v-flex xs8 sm6>
            <v-text-field
              name="input-7-1"
              label="Description"
              v-model="description"
              multi-line
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs4>
            <v-subheader class="subheading">Homepage</v-subheader>
          </v-flex>
          <v-flex xs8 sm6>
            <v-text-field
              label="Homepage"
              v-model="homepage"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs4>
            <v-subheader class="subheading">License</v-subheader>
          </v-flex>
          <v-flex xs8 sm6>
            <v-select
              :items="licenseItems"
              :filter="customFilter"
              v-model="license"
              item-text="name"
              label="Select"
              autocomplete
            ></v-select>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs4>
            <v-subheader class="subheading">.gitignore</v-subheader>
          </v-flex>
          <v-flex xs8 sm6>
            <v-select
              :items="gitignoreItems"
              :filter="customFilter"
              v-model="gitignore"
              item-text="name"
              label="Select"
              autocomplete
            ></v-select>
          </v-flex>
        </v-layout>
        <v-radio-group v-model="radioGroup" color="primary">
          <v-radio
            label="Public"
            value="public"
            color="primary"
          ></v-radio>
          <v-radio
            label="Private"
            value="private"
            color="primary"
          ></v-radio>
        </v-radio-group>
        <v-layout row>
          <v-flex xs12>
            <v-checkbox color="primary" label="Initiate this repository with a README" v-model="readmeCheckbox"></v-checkbox>
          </v-flex>
        </v-layout>
        <v-btn
          @click="submit"
          :disabled="!valid"
        >
          Create New Repository
        </v-btn>
        <v-btn @click="clear">clear</v-btn>
      </v-form>
    </v-container>

</template>

<script>
  import axios from 'axios'
  export default {
    name: 'CreateRepo',
    data () {
      return {
        valid: true,
        name: '',
        description: '',
        nameRules: [
          v => !!v || 'Repository name is required'
        ],
        homepage: '',
        select: null,
        items: [
          'Item 1',
          'Item 2',
          'Item 3',
          'Item 4'
        ],
        licenseItems: [],
        license: '',
        gitignoreItems: [],
        gitignore: '',
        checkbox: '',
        radioGroup: 1,
        public: true,
        private: false,
        readmeCheckbox: false,
        error: false,
        errorMessage: '',
        success: false,
        successMessage: ''
      }
    },
    mounted () {
      var _self = this
      axios.get('/licenses').then(function (data) {
        var items = data.data
        items.forEach(function (item) {
          _self.licenseItems.push(item)
        })
      })
      axios.get('/gitignore/templates').then(function (data) {
        var items = data.data
        items.forEach(function (item) {
          _self.gitignoreItems.push(item)
        })
      })
    },
    computed: {
      publicOrPrivate: function () {
        return this.radioGroup === 'private'
      }
    },
    methods: {
      submit () {
        if (this.$refs.form.validate()) {
          // Native form submission is not yet supported
          var _self = this
          axios.post('/user/repos', {
            name: this.name,
            description: this.description,
            homepage: this.homepage,
            license: this.license.key,
            gitignore: this.gitignore,
            private: this.publicOrPrivate,
            auto_init: this.readmeCheckbox
          }).then(function (response) {
            if (response.status === 201) {
              _self.successMessage = 'Repository created, you\'ll be redirected in 5 seconds'
              _self.success = true
              setTimeout(function () {
                _self.$router.push('/repos')
                _self.$destroy()
              }, 5000)
            }
          }).catch(function (error) {
            _self.errorMessage = 'Something went wrong, check your inputs.'
            _self.error = true
            setTimeout(function () {
              _self.error = false
            }, 5000)
            throw error
          })
        }
      },
      clear () {
        this.$refs.form.reset()
      }
    }
  }
</script>

<style scoped>
  .custom-alert {
    position: absolute;
    top: 14%;
    left: 50%;
    right: 5%;
  }
</style>
