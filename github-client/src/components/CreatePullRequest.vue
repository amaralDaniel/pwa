<template>
  <v-container  grid-list-md text-xs-center>
    <v-form v-model="valid" ref="form" lazy-validation>
      <v-layout row wrap>
        <v-flex xs4>
          <v-subheader class="subheading">Title</v-subheader>
        </v-flex>
        <v-flex xs12 sm6>
          <v-text-field
            label="Title"
            v-model="title"
            :rules="titleRules"
            :counter="50"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12>
          <div class="add-comment">
            <!--<textarea name="comment" id="comment" cols="30" rows="10" placeholder="Insert your commment here" v-model="comment.body"></textarea>-->
            <v-layout row>
              <v-text-field
                name="input-7-1"
                full-width
                multi-line
                single-line
                v-model="comment"
                placeholder="Leave a comment here"
              ></v-text-field>
            </v-layout>
          </div>
        </v-flex>
      </v-layout>
      <v-btn
        @click="pushNewIssue"
        :disabled="!valid"
      >
        Submit new isue
      </v-btn>
      <v-btn @click="clear">clear</v-btn>
    </v-form>
  </v-container>

</template>

<script>
  export default {
    name: 'CreatePullRequest'
  }
</script>

<style scoped>

</style>
