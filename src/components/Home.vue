<template>
  <div>
    <b-jumbotron>
      <b-container>
        <h1 class="display-3 mb-0" style="height:100px">
          FundiesCollab
          <b-img lazy style="width:90px; padding-bottom:20px;" src="/check-plus.png" />
        </h1>
        <p class="lead">
          Collaborative Real-Time Coding in Java using the Fundies 2 Tester and Image
          libraries.
        </p>
        <hr />

        <p>Share code, pair program, and test as you go.</p>
        <router-link to="/room">
          <b-button size="lg" variant="primary">Start Coding</b-button>
        </router-link>
      </b-container>
    </b-jumbotron>
    <b-container>
      <b-row>
        <b-col>
          <h3>Real-Time Collaboration</h3>
          <p>
            FundiesCollab allows you to code with other people at the same
            time on the same document. Coding partners can remotely
            contribute to a single file and easily share code. No more
            messing around with git or inconvient forms of file sharing,
            simply open up your browser to start working together and
            download your code when you're done.
          </p>
        </b-col>
        <b-col>
          <h3>Save and Share Online</h3>
          <p>
            When you work on FundiesCollab, you jump into a random room. You
            can easily share the room to collaborate with others simply by
            sharing the link in your browser! The code in your room can be
            stored for up to 7 days after your last edit.
          </p>
        </b-col>
        <b-col>
          <h3>Tester Library</h3>
          <p>
            At the click of a button, you can send your code to our servers,
            compile, run, and receive the results in seconds. Unlike any
            other online collaborative editor, you have nearly full access
            to the Fundies 2 Tester and Image libraries.* Enjoy the ease of
            real time collaboration with the convienice of on the fly
            testing.
          </p>
          <i>
            * You are unable to use bigBang, or render any shapes from the
            Image library to canvas.
          </i>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div class="mt-5 mb-4">
            <i>FundiesCollab</i>
            <p>Created by Ryan Jung @ Northeastern University</p>

            <a href="https://github.com/rymaju/FundiesCollab">Github</a>
            {{' | '}}
            <a
              href="https://course.ccs.neu.edu/cs2510/Documentation.html"
            >Image & Tester Library Docs</a>
            {{' | '}}
            <a href="https://course.ccs.neu.edu/cs2510/">Fundies 2 Homepage</a>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>



<script>
export default {
  name: "Home"
};
</script>

<style>
</style>
