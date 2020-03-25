<template>
  <div id="room" style="height:100%">
    <b-row no-gutters>
      <b-col>
        <b-container fluid id="header" class="icon-bar side">
          <div style="width:220px">
            <b-spinner
              v-if="compiling"
              label="Loading..."
              class="mt-3 ml-5"
              style="min-width:32px; margin-right:58px;"
            ></b-spinner>
            <b-icon
              v-else
              @click="compile"
              icon="play-fill"
              class="icon ml-5"
              style="height:50px;width:50px; margin-top:7px; margin-right:40px; color:#28a745"
            />
          </div>
          <b-input-group prepend="Example Classes" style="height:35px; margin-top: 14px" class>
            <b-form-input v-model="examplesClasses"></b-form-input>
          </b-input-group>

          <b-input-group style="height:35px; width:900px; margin-top: 14px" class="ml-3 mr-5">
            <b-form-input v-bind:value="url" v-bind:readonly="true"></b-form-input>
            <b-input-group-append>
              <b-button
                variant="primary"
                v-clipboard:copy="url"
                v-clipboard:success="onCopy"
              >{{copyText}}</b-button>
            </b-input-group-append>
          </b-input-group>

          <b-icon
            @click="download"
            icon="cloud-download"
            class="mr-5 icon"
            style="height:35px;width:35px; margin-top:15px"
          />

          <b-icon
            @click="switchTheme"
            v-bind:icon="themeIcon"
            class="mr-5 icon"
            style="height:40px;width:40px; margin-top:10px"
          />
        </b-container>
      </b-col>
    </b-row>

    <b-row no-gutters style="max-width: 100vw; width: 100vw; max-height: calc(100vh - 70px);">
      <b-col>
        <MonacoEditor
          class="editor"
          v-model="code"
          language="java"
          v-bind:theme="theme"
          v-bind:options="{ scrollBeyondLastLine: false, wordWrap: 'on'}"
          @change="codeChange"
        />
      </b-col>
      <b-col>
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
            wordWrap: 'on'
          }"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import MonacoEditor from "vue-monaco";
import axios from "axios";
const io = require("socket.io-client");
const socket = io();
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
    codeChange() {
      socket.emit("send code", { room: this.room, newCode: this.code });
    },
    onCopy() {
      this.copyText = "Copied!";
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
      this.compiling = true;
      this.output = "Running code...";
      axios
        .post(
          process.env.NODE_ENV === "production"
            ? "https://fundiescollab.com/api/compile/java"
            : "http://localhost:5000/api/compile/java",
          {
            fileName: "Test.java",
            examplesClasses: this.examplesClasses.split(" "),
            javaCode: this.code,
            roomId: this.room
          }
        )
        .then(response => {
          this.output = this.cleanOutput(response.data.out);
        })
        .catch(error => {
          console.log("run");
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
        });
    }
  },
  beforeDestroy() {
    socket.emit("leave room", { room: this.state.roomId });
  },
  mounted() {
    console.log(window.location.pathname.split("/")[2]);
    if (localStorage.darkMode && localStorage.darkMode == "true") {
      this.darkMode = true;
    }
    socket.emit("join room", { room: this.room });

    socket.on("sync code", payload => {
      this.code = payload.newCode;
    });
  },

  data() {
    return {
      copyText: `Copy`,
      url: `fundiescollab.com${window.location.pathname}`,
      room: window.location.pathname.split("/")[2],
      examplesClasses: "ExamplesFoo",
      compiling: false,
      darkMode: false,
      output: `Write your code in the editor above, then list out your examples classes (with spaces between), and press the green "Run" button to see the results down here!`,
      code: `import tester.Tester; 
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

class ExamplesFoo { 
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
#app {
  width: 100%;
  height: 100%;
}
#header {
  height: 70px;
}

#room {
  overflow: hidden;
}

.icon:hover {
  cursor: pointer;
}

.icon-bar {
  display: flex;
  justify-content: space-between;
}

.side {
  background-color: #191919;
  color: azure;
  font-weight: lighter;
}
.editor {
  height: calc(100vh - 70px);
  width: 60vw;
}
.output {
  height: calc(100vh - 70px);
}
</style>