<template>
  <div>
    <b-alert
      v-model="showAlert"
      variant="danger"
      dismissible
      class="position-fixed fixed-top m-2"
      fade
      style="z-index: 2000;"
    >{{ error }}</b-alert>

    <b-container style="max-width:800px; padding-top:20vh; max-height: 100vh;">
      <h1>Login</h1>
      <b-form @submit.prevent="submitWithFirebase" class="mb-3">
        <b-form-group id="input-group-1" label="Email address:" label-for="input-1">
          <b-form-input
            id="input-1"
            v-model="email"
            type="email"
            required
            placeholder="Enter email"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="Password:" label-for="input-2">
          <b-form-input
            type="password"
            id="input-2"
            v-model="password"
            required
            placeholder="Enter password"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="success">Submit</b-button>
      </b-form>
      <p class="mb-0">
        Don't have an account? You can
        <router-link to="/signup">sign up</router-link>
        {{" "}}to create one!
      </p>
      <small>
        <router-link to="/">Back home</router-link>
      </small>
    </b-container>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Home",
  data() {
    return {
      email: "",
      password: "",
      error: ""
    };
  },
  computed: {
    showAlert() {
      return this.error.length > 0;
    }
  },
  methods: {
    submitWithFirebase() {
      this.error = "";
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          () => {
            this.$router.push("/");
          },
          () => {
            this.error =
              "There was an issue logging in with the given email and password. Please try again.";
            console.log(this.error !== "");
          }
        );
    }
  }
};
</script>

<style>
</style>
