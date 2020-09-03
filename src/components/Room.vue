<template>
  <div id="room" class="side">
    <b-row no-gutters>
      <b-col>
        <b-container fluid id="header" class="icon-bar side">
          <div>
            <b-spinner
              v-if="compiling"
              label="Loading..."
              class="mt-3"
              style="min-width:32px; margin-right: 32px;"
            ></b-spinner>
            <b-icon
              v-else
              @click="compile"
              icon="play-fill"
              class="icon"
              style="height:50px; min-width:50px; margin-top:7px; color:#28a745"
            />
          </div>

          <b-icon
            v-b-modal.modal-1
            icon="gear-fill"
            class="icon"
            style="height:32px;width:32px; margin-top:15px"
          />

          <b-modal id="modal-1" title="Editor Settings" hide-footer>
            

            <b-check v-model="inJava" switch>
              <label>Racket/Java mode</label>
            </b-check>
            <b-check v-model="darkMode" switch>
              <label>Dark mode</label>
            </b-check>

            <b-form-group
              v-if="inJava"
              id="input-group-1"
              label="Example Classes"
              description="A space delimited list of example classes to compile"
            >
              <b-form-input v-model="examplesClasses" :state="validation()" spellcheck="false" />
              <b-form-invalid-feedback
                :state="validation()"
              >Must be a space delimited string of classes</b-form-invalid-feedback>
              <b-form-valid-feedback :state="validation()">Looks good!</b-form-valid-feedback>
            </b-form-group>
          </b-modal>

          <b-icon
            icon="link45deg"
            class="icon"
            style="height:35px;width:35px; margin-top:15px"
            @click="copyURL"
            id="copy-icon"
          />

          <b-tooltip :show.sync="showCopyTooltip" target="copy-icon" placement="bottom">{{copyText}}</b-tooltip>

          <b-icon
            @click="download"
            icon="cloud-download"
            class="icon"
            style="height:35px;width:35px; margin-top:15px"
          />

          <b-icon
            @click="switchTheme"
            v-bind:icon="themeIcon"
            class="icon"
            style="height:40px;width:40px; margin-top:10px"
          />
        </b-container>
      </b-col>
    </b-row>

    <b-row no-gutters style="max-width: 100vw; width: 100vw; max-height: calc(100vh - 70px);">
      <b-col lg="7">
        <MonacoEditor
          v-if="inJava"
          class="editor"
          v-model="javaCode"
          language="java"
          v-bind:theme="theme"
          v-bind:options="{ 
            scrollBeyondLastLine: false, 
            wordWrap: 'on',
            automaticLayout: true}"
          @change="codeChange"
        />
        <MonacoEditor
          v-else
          class="editor"
          v-model="racketCode"
          language="scheme"
          v-bind:theme="theme"
          v-bind:options="{ 
            scrollBeyondLastLine: false, 
            wordWrap: 'on',
            automaticLayout: true}"
          @change="codeChange"
        />
      </b-col>
      <b-col lg="5">
        <MonacoEditor
          class="output"
          v-bind:value="`\n${output}`"
          language="text"
          v-bind:theme="theme"
          v-bind:options="{ 
            readOnly: true, 
            scrollBeyondLastLine: false, 
            lineNumbers: false,
            renderLineHighlight: false, 
            wordWrap: 'on',
            automaticLayout: true

          }"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import MonacoEditor from "vue-monaco";
import firebase from "firebase";
import axios from "axios";
const io = require("socket.io-client");
const socket = io.connect('https://fundiescollab.com', {secure: true});
const fileDownload = require("js-file-download");

export default {
  name: "Room",
  components: {
    MonacoEditor
  },
  computed: {
    theme() {
      if (this.darkMode) {
        return `vs-dark`;
      } else {
        return `vs`;
      }
    },
    themeIcon() {
      if (this.darkMode) {
        return `sun`;
      } else {
        return `moon`;
      }
    }
  },
  methods: {
    validation() {
      const examplesClassesRegex = /^[A-z]+(\s[A-z]+)*$/;
      return examplesClassesRegex.test(this.examplesClasses);
    },
    copyURL() {
      this.$copyText(this.url);
      this.showCopyTooltip = true;
      this.copyText = "Copied!";
    },
    codeChange() {
      socket.emit("send code", { room: this.room, newCode: this.code });
    },
    switchTheme() {
      this.darkMode = !this.darkMode;
      localStorage.darkMode = this.darkMode;
    },
    download() {
      fileDownload(this.code, this.room + ".java");
    },
    cleanOutput(output) {
      const junk = `\tat java`;

      const lines = output.split("\n");

      let cleanOutput = "";

      for (let line of lines) {
        if (!line.startsWith(junk)) {
          cleanOutput += line + "\n";
        }
      }

      return cleanOutput;
    },
    compile() {
      socket.emit("send compile", { room: this.room });
      this.compiling = true;
      this.output = "Running code...";
      firebase
        .auth()
        .currentUser.getIdToken(true)
        .then(token => {
          axios
            .post(
              this.inJava
                ? "https://fundiescollab.com/api/compile/java"
                : "https://fundiescollab.com/api/compile/racket",
              {
                fileName: this.inJava ? "Test.java" : "test.rkt",
                examplesClasses: this.examplesClasses.split(" "),
                code: this.inJava ? this.javaCode : this.racketCode,
                roomId: this.room
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`
                }
              }
            )
            .then(response => {
              this.output = this.cleanOutput(response.data.out);
            })
            .catch(error => {
              try {
                if (error.response.data.err === "Java execution timed out") {
                  this.output =
                    "Your code took way too long to execute! Look for infinite loops or recursion and try again.";
                } else if (error.response.status === 500) {
                  this.output =
                    "Yikes, something went wrong with our servers. Sorry! Email me at ryan.matthew.jung@gmail.com to let me know there's a problem. In the meantime, you can download your code and work offline.";
                } else {
                  this.output =
                    "Oops! There was a problem processing your request. Please wait 60 seconds and try again.";
                }
              } catch (err) {
                this.output =
                  "We cant seem to connect to our servers, sorry! In the meantime, you can download your code and work offline.";
              }
              console.log(this.output);
            })
            .finally(() => {
              this.compiling = false;
              socket.emit("send output", { room: this.room, out: this.output });
            });
        })
        .catch(err => {
          console.log(err);
          this.output =
            "Oops! There was a problem processing your request related to authentication. Try reloading the page and try again.";
        });
    }
  },
  beforeDestroy() {
    socket.emit("leave room", { room: this.room });
  },
  mounted() {
    if (localStorage.darkMode && localStorage.darkMode == "true") {
      this.darkMode = true;
    }
    socket.emit("join room", { room: this.room });

    socket.on("sync code", payload => {
      this.code = payload.newCode;
    });
    socket.on("sync compile", () => {
      this.compiling = true;
      this.output = "Running code...";
    });
    socket.on("sync output", payload => {
      this.output = payload.out;
      this.compiling = false;
    });
  },

  data() {
    return {
      inJava: false,
      showCopyTooltip: false,
      copyText: `Copy URL`,
      url: `fundiescollab.com${window.location.pathname}`,
      room: window.location.pathname.split("/")[2],
      examplesClasses: "Examples",
      compiling: false,
      darkMode: false,
      output: `Press the green "Run" button to run and compile your code.\n\nCode in this room is only saved for up to 7 days after the last edit, so remember to download your code when you're done!`,
      racketCode: `#lang racket
(define (fib n)
  (cond
    [(<= n 2) 1]
    [else (+ (fib (- n 1)) (fib (- n 2)))]))
      
(fib 10)
      
      `,
      javaCode: `import tester.Tester; 
import javalib.worldimages.*; 
import java.awt.Color; 

class Foo { 
  int a; 
  int b; 

  Foo(int a, int b) { 
    this.a = a; this.b = b; } 
      
  int add() {
    return this.a + this.b; 
  } 
  
  WorldImage render() { 
    return new CircleImage(10, OutlineMode.SOLID, Color.PINK); 
  } 
} 

class Examples { 
  void testFoo(Tester t) {
    t.checkExpect(new Foo(1, 2).add(), 3); 
    t.checkExpect(new Foo(4, 56).add(), 60);
    t.checkExpect(new Foo(1, 2).render(), new CircleImage(10, OutlineMode.SOLID, Color.PINK)); 
    // Fail 
    t.checkExpect(new Foo(1, 2).add(), 4); 
  } 
}
`
    };
  }
};
</script>

<style>
#header {
  height: 70px;
}

#room {
  overflow-x: hidden;
}
.icon {
  margin: 16px;
}
.icon:hover {
  cursor: pointer;
}

.icon-bar {
  display: flex;
  justify-content: flex-end;
}

.side {
  background-color: #191919;
  color: azure;
  font-weight: lighter;
}
.editor {
  height: calc(100vh - 70px);
}
.output {
  height: calc(100vh - 70px);
}
</style>