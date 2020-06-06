<template>
  <b-overlay :show="creatingRoom" rounded="lg" spinner-variant="primary">
    <b-alert
      v-model="showError"
      class="position-fixed fixed-top m-2"
      fade
      style="z-index: 2000;"
      variant="danger"
      dismissible
    >Oops, we encountered an error connecting to our servers. Please wait and try again later.</b-alert>
    <b-container class="form-container">
      <b-form class="create-room" v-on:submit.prevent="createRoom">
        <h2>Create a room</h2>

        <b-form-group
          id="input-group-1"
          label="Room ID:"
          label-for="input-1"
          description="Your room ID is a unique identifier that will allow you to share your work just by sharing the link"
        >
          <b-form-input v-on:input="onChange" v-model="room" :state="validation()" />
          <b-form-invalid-feedback :state="validation()">{{validationErrors}}</b-form-invalid-feedback>
          <b-form-valid-feedback :state="validation()">Looks good!</b-form-valid-feedback>
        </b-form-group>

        <b-button variant="success" @click="createRoom" :disabled="!validation()">Create Room</b-button>
      </b-form>
    </b-container>
  </b-overlay>
</template>

<script>
import axios from "axios";
import Haikunator from "haikunator";
const haikunator = new Haikunator();

export default {
  name: "Home",
  components: {},
  data() {
    return {
      creatingRoom: false,
      isUniqueRoom: true,
      showError: false,
      room: this.generateHaiku()
    };
  },
  computed: {
    validationErrors() {
      if (this.room.length < 8 || this.room.length > 50) {
        return "Room ID must be between 8-50 characters.";
      } else if (this.room.split(" ").length > 1) {
        return "Rooms cannot have spacces";
      } else if (!/^[a-zA-Z0-9-_]+$/.test(this.room)) {
        return "Room can only be comprised of alphanumeric characters, underscores, and dashes.";
      } else if (!this.isUniqueRoom) {
        return "Room is taken, try another name.";
      }

      return "";
    }
  },

  methods: {
    onChange() {
      this.isUniqueRoom = true;
      console.log("changed");
    },
    validation() {
      return this.validationErrors.length === 0;
    },
    generateHaiku() {
      return haikunator.haikunate();
    },
    createRoom() {
      this.creatingRoom = true;
      axios
        .get(
          process.env.NODE_ENV === "production"
            ? "https://fundiescollab.com/api/room/" + this.room
            : "http://localhost:5000/api/room/" + this.room
        )
        .then(response => {
          if (response.data.exists) {
            this.isUniqueRoom = false;
            this.creatingRoom = false;
          } else {
            this.$router.push(
              `room/${this.room.trim()}`,
              () => {
                this.creatingRoom = false;
              },
              () => {
                this.creatingRoom = false;
                this.showError = true;
              }
            );
          }
        })
        .catch(err => {
          console.error(err);
          this.creatingRoom = false;
          this.showError = true;
        });
    }
  }
};
</script>

<style>
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.create-room {
  width: 600px;
  padding-bottom: 15vh;
}
</style>
