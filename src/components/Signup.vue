<template>
  <b-overlay :show="waitingForAuth" rounded="lg" spinner-variant="primary">
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
        <h2>Sign up</h2>

        <b-form @submit.prevent="submitWithFirebase" class="mb-3">
          <b-form-group
            id="input-group-1"
            label="Email address:"
            label-for="input-1"
            description="We'll never share your email with anyone else."
          >
            <b-form-input
              id="input-1"
              v-model="email"
              type="email"
              required
              placeholder="Enter email"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-2"
            label="Password:"
            label-for="input-2"
            description="We use Firebase, a trusted authentication service. We never store your password."
          >
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
          Already have an account? Click here to
          <router-link :to="{ path: '/login', query: this.$route.query }">login</router-link>!
        </p>

        <small>
          <router-link to="/">Back home</router-link>
        </small>
      </b-container>
    </div>
  </b-overlay>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Home",
  data() {
    return {
      email: "",
      password: "",
      error: "",
      waitingForAuth: false
    };
  },
  computed: {
    showAlert() {
      return this.error.length > 0;
    }
  },

  methods: {
    submitWithFirebase() {
      if (this.password.length < 8) {
        this.error = `Woah! Your password cant be less than 8 characters. Honestly, even 8 is pretty unsafe. You really want something 10+ characters long. Try a phrase like "Correct_Horse_Battery_Staple".`;
        return;
      }

      if (this.password === "Correct_Horse_Battery_Staple") {
        this.error =
          "Seriously? No, your password cant be Correct_Horse_Battery_Staple. Please be more creative.";
        return;
      }
      this.waitingForAuth = true;
      this.error = "";
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(
          () => {
            if (this.$route.query.room) {
              this.$router.push(`/room/${this.$route.query.room}`);
            } else {
              this.$router.push("/");
            }
          },
          err => {
            this.waitingForAuth = false;

            this.error = `Oops! ${err.message}`;
          }
        );
    }
  }
};
</script>

<style></style>
