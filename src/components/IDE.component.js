import React, { Component } from 'react'
import axios from 'axios'
import { Controlled as CodeMirror } from 'react-codemirror2'
import '../theme/eclipse.css'
import '../theme/dracula.css'
import '../theme/material-palenight.css'

const fileDownload = require('js-file-download')

require('./custom-codemirror.css')
require('codemirror/addon/edit/closebrackets')
require('codemirror/addon/edit/matchbrackets')

require('codemirror/addon/hint/show-hint')
const anyword = require('codemirror/addon/hint/anyword-hint')

require('codemirror/addon/display/rulers')

require('codemirror/addon/selection/active-line')

require('codemirror/addon/search/match-highlighter')

require('codemirror/mode/clike/clike')

class IDE extends Component {
  constructor () {
    super()
    this.state = {
      fileName: 'Foo.java',
      examplesClasses: ['ExamplesFoo'],
      javaCode: `import tester.Tester;
import javalib.worldimages.*;
import java.awt.Color;

class Foo {
  int a;
  int b;

  Foo(int a, int b) {
    this.a = a;
    this.b = b;
  }

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
    t.checkExpect(new Foo(1, 2).render(), new CircleImage(11, OutlineMode.SOLID, Color.YELLOW));
  }
}

`,
      output: '',
      disableButton: false,
      roomId: '1234',
      keyPressState: false,
      saved: false,
      saveDateTime: 'Never'
    }

    this.handleFileChange = this.handleFileChange.bind(this)
    this.handleExamplesChange = this.handleExamplesChange.bind(this)
    this.handleCodeChange = this.handleCodeChange.bind(this)
    this.compile = this.compile.bind(this)
    this.loadFromLocalStorage = this.loadFromLocalStorage.bind(this)
    this.getCodeFromLocalStorage = this.getCodeFromLocalStorage.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.download = this.download.bind(this)

    this.saveToLocalStorage = this.saveToLocalStorage.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)

    document.body.addEventListener('keydown', this.handleKeyDown)
    document.body.addEventListener('keyup', this.handleKeyUp)
  }

  handleFileChange (event) {
    this.setState({ fileName: event.target.value })
    //console.log(this.state)
  }
  handleExamplesChange (event) {
    this.setState({ examplesClasses: event.target.value.split(' ') })
    //console.log(this.state)
  }
  handleCodeChange (newCode) {
    this.setState({ javaCode: newCode, saved: false })
  }

  saveToLocalStorage () {
    const { fileName, examplesClasses, javaCode, roomId } = this.state
    localStorage.setItem('fileName', fileName)
    localStorage.setItem('examplesClasses', examplesClasses)
    localStorage.setItem('javaCode', javaCode)
    localStorage.setItem('roomId', roomId)
    console.log('saving')
    this.setState({
      saved: true,
      saveDateTime: new Date().toLocaleString()
    })
  }

  download () {
    fileDownload(this.state.javaCode, this.state.fileName)
  }

  loadFromLocalStorage () {
    if (this.state.roomId !== localStorage.getItem('roomId')) {
      // wrong room
      return
    }
    const storedFileName = localStorage.getItem('fileName')
    const storedExamplesClasses = localStorage.getItem('examplesClasses')
    const storedJavaCode = localStorage.getItem('javaCode')

    if (storedFileName !== null) {
      this.setState({ fileName: storedFileName })
      console.log('set file')
    }
    if (storedExamplesClasses !== null) {
      this.setState({ examplesClasses: storedExamplesClasses })
      console.log('set examples')
    }
    if (storedJavaCode !== null) {
      this.setState({
        javaCode: storedJavaCode,
        saved: true,
        saveDateTime: new Date().toLocaleString()
      })
    }
  }

  getCodeFromLocalStorage () {
    if (
      this.state.roomId !== localStorage.getItem('roomId') ||
      this.state.javaCode === localStorage.getItem('javaCode')
    ) {
      return this.state.javaCode
    }
    const storedJavaCode = localStorage.getItem('javaCode')
    console.log(storedJavaCode)
    if (storedJavaCode) {
      this.setState({ javaCode: storedJavaCode })
      return storedJavaCode
    } else {
      return this.state.javaCode
    }
  }

  handleKeyDown (e) {
    if (this.state.keyPressState && e.keyCode === 83) {
      e.preventDefault()
      this.saveToLocalStorage()
    } else if (this.state.keyPressState && e.keyCode === 82) {
      e.preventDefault()

      this.compile()
    } else if (e.keyCode === 17 || 91) {
      this.setState({ keyPressState: true })
    }
  }
  handleKeyUp (e) {
    if (e.keyCode === 17 || 91) {
      this.setState({ keyPressState: false })
    }
  }

  compile () {
    this.setState({
      output: 'Running code... Please wait while we run your tests',
      disableButton: true
    })

    console.log(this.state.javaCode)

    axios
      .post('http://localhost:5000/api/compile/java', {
        fileName: this.state.fileName,
        examplesClasses: this.state.examplesClasses,
        javaCode: this.state.javaCode
      })
      .then(response => {
        console.log(response.data)

        if (response.data === null || response.data === '') {
          this.setState({
            output:
              'Your code took way too long to execute! Look for infinite loops or recursion and try again.',
            disableButton: false
          })
        } else {
          this.setState({
            output: response.data,
            disableButton: false
          })
        }
      })
      .catch(error => {
        console.log(error)
        this.setState({
          output:
            'Oops! There was a problem processing your request. Please wait 60 seconds and try again.',
          disableButton: false
        })
      })
  }

  componentDidMount () {
    this.loadFromLocalStorage()
  }

  render () {
    return (
      <div
        style={{
          margin: '40px',
          display: 'grid',
          gridTemplateColumns: ' 50vw 40vw',
          gridGap: '10px',
          justifyContent: 'center'
        }}
      >
        <div id='interactive'>
          <div>
            <span>
              <label>Name </label>
              <input
                id='file'
                size='20'
                type='text'
                onChange={this.handleFileChange}
                value={this.state.fileName}
                spellCheck='false'
              ></input>
            </span>
            <span
              style={{
                margin: '10px'
              }}
            >
              <label>Examples </label>
              <input
                id='file'
                size='40'
                type='text'
                onChange={this.handleExamplesChange}
                value={this.state.examplesClasses}
                spellCheck='false'
              ></input>
            </span>
          </div>

          <div
            style={{
              marginTop: '10px'
            }}
          >
            <button
              disabled={this.state.disableButton}
              onClick={() => this.compile()}
            >
              Compile
            </button>

            <button
              disabled={this.state.disableButton}
              onClick={() => this.download()}
            >
              Download Code
            </button>

            <button
              disabled={this.state.disableButton}
              onClick={() => this.saveToLocalStorage()}
            >
              Save to LocalStorage
            </button>

            <CodeMirror
              value={this.state.javaCode}
              onBeforeChange={(editor, data, value) => {
                this.setState({ javaCode: value, saved: false })
              }}
              onChange={(editor, data, value) => {}}
              options={{
                lineNumbers: true,
                rulers: [{ color: '#ccc', column: 100, lineStyle: 'dashed' }],

                mode: 'text/x-java',
                matchBrackets: true,
                autoCloseBrackets: true,
                showHint: {
                  hint: anyword
                },
                theme: 'eclipse',
                styleActiveLine: true,
                highlightSelectionMatches: true
              }}
            />
          </div>
          <p>
            <i>
              Online compiler does not support bigBang, download the .java file
              and run in Eclipse.
            </i>
          </p>
          <p>Ctrl+S to Save, Ctrl+R to Compile & Run</p>
        </div>

        <div id='output' style={{}}>
          <p>
            {!this.state.saved
              ? 'Last saved: ' + this.state.saveDateTime
              : 'Saved and up to date as of ' + this.state.saveDateTime + ''}
          </p>
          <p
            style={{
              whiteSpace: 'pre-wrap',
              margin: '0',
              border: '2px dashed #ccc ',
              padding: '10px',
              fontFamily: 'monospace',
              fontSize: '13px',
              minHeight: '70vh',
              height: 'auto'
            }}
          >
            {this.state.output}
          </p>
        </div>
      </div>
    )
  }
}

export default IDE
