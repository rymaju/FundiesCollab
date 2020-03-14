import React, { Component } from 'react'
import axios from 'axios'
import { Controlled as CodeMirror } from 'react-codemirror2'
import '../theme/eclipse.css'
import '../theme/dracula.css'
import '../theme/material-palenight.css'

import lightMode from './IDELight.module.css'
import darkMode from './IDEDark.module.css'

import {
  Button,
  ButtonGroup,
  Spinner,
  Label,
  Input,
  Row,
  Col,
  UncontrolledAlert
} from 'reactstrap'
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

const io = require('socket.io-client')
const socket = io()

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
      roomId: '',
      keyPressState: false,
      theme: 'eclipse',
      style: lightMode
    }

    socket.on('sync code', payload => {
      console.log(payload)
      this.setState({ javaCode: payload.newCode })
    })

    this.handleFileChange = this.handleFileChange.bind(this)
    this.handleExamplesChange = this.handleExamplesChange.bind(this)
    this.handleCodeChange = this.handleCodeChange.bind(this)
    this.compile = this.compile.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.download = this.download.bind(this)
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
  handleCodeChange (editor, data, value) {
    this.setState({ javaCode: value })

    socket.emit('send code', {
      room: this.state.roomId,
      newCode: value
    })
  }

  download () {
    fileDownload(this.state.javaCode, this.state.fileName)
  }

  handleKeyDown (e) {
    if (this.state.keyPressState && e.keyCode === 83) {
      e.preventDefault()
    } else if (this.state.keyPressState && e.keyCode === 82) {
      e.preventDefault()
      this.compile()
    } else if (e.keyCode === 17 || e.keyCode === 91) {
      this.setState({ keyPressState: true })
    }
  }
  handleKeyUp (e) {
    if (e.keyCode === 17 || e.keyCode === 91) {
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
        javaCode: this.state.javaCode,
        roomId: this.state.roomId
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
    this.setState({ roomId: this.props.match.params.id }, () => {
      socket.emit('join room', { room: this.state.roomId })
      console.log(this.state.roomId)
    })
    console.log(this.props)
  }

  componentWillUnmount () {
    socket.emit('leave room', {
      room: this.state.roomId
    })
  }

  render () {
    return (
      <div className={this.state.style.IDEContainer}>
        <Col>
          <Row>
            <Col>
              <Row>
                <Col xs='5'>
                  <Label className={this.state.style.text}>Name </Label>
                  <Input
                    className={this.state.style.containerColor}
                    id='file'
                    size='20'
                    type='text'
                    onChange={this.handleFileChange}
                    value={this.state.fileName}
                    spellCheck='false'
                  />
                </Col>
                <Col xs='7'>
                  <Label className={this.state.style.text}>Examples </Label>
                  <Input
                    className={this.state.style.containerColor}
                    id='file'
                    size='40'
                    type='text'
                    onChange={this.handleExamplesChange}
                    value={this.state.examplesClasses}
                    spellCheck='false'
                  />
                </Col>
              </Row>
              <Row>
                <Col className={`mt-2`}>
                  <ButtonGroup
                    style={{
                      marginBottom: '10px'
                    }}
                  >
                    <Button
                      color='success'
                      size='sm'
                      disabled={this.state.disableButton}
                      onClick={() => this.compile()}
                    >
                      Compile
                    </Button>

                    <Button
                      outline
                      color='success'
                      size='sm'
                      disabled={this.state.disableButton}
                      onClick={() => this.download()}
                    >
                      Download Code
                    </Button>
                    <select
                      style={{
                        marginLeft: '5px',
                        fontSize: '15px',
                        borderColor: '#007bff',
                        fontWeight: '400',
                        borderRadius: '2px',
                        color: '#007bff'
                      }}
                      className={this.state.style.containerColor}
                      onChange={event => {
                        const themeName = event.target.value
                        this.setState({ theme: event.target.value })
                        if (themeName === 'eclipse') {
                          this.setState({ style: lightMode })
                        } else {
                          this.setState({ style: darkMode })
                        }
                      }}
                    >
                      <option value='eclipse' defaultValue>
                        Eclipse
                      </option>
                      <option value='dracula'>Dracula</option>
                      <option value='material-palenight'>
                        Palenight
                      </option>={' '}
                    </select>
                  </ButtonGroup>
                  {this.state.disableButton && (
                    <span
                      style={{
                        marginLeft: '10px'
                      }}
                    >
                      <Spinner
                        style={{
                          marginLeft: '10px',
                          width: '25px',
                          height: '25px'
                        }}
                        color='primary'
                        type='grow'
                      />
                      <Spinner
                        style={{
                          marginLeft: '10px',
                          width: '25px',
                          height: '25px'
                        }}
                        color='primary'
                        type='grow'
                      />
                      <Spinner
                        style={{
                          marginLeft: '10px',
                          width: '25px',
                          height: '25px'
                        }}
                        color='primary'
                        type='grow'
                      />
                    </span>
                  )}
                  <UncontrolledAlert size='sm' color='danger'>
                    Rooms automatically save your work. However, after 7 days of
                    inactivity your room will be deleted, so remember to
                    download your code when you're done!
                  </UncontrolledAlert>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col xs='7' className={`pr-2`}>
              <CodeMirror
                value={this.state.javaCode}
                onBeforeChange={this.handleCodeChange}
                onChange={(editor, data, value) => {}}
                options={{
                  scrollbarStyle: null,
                  lineNumbers: true,
                  rulers: [
                    { color: '#007BFF', column: 100, lineStyle: 'dashed' }
                  ],

                  mode: 'text/x-java',
                  matchBrackets: true,
                  autoCloseBrackets: true,
                  showHint: {
                    hint: anyword
                  },
                  theme: this.state.theme,
                  styleActiveLine: true,
                  highlightSelectionMatches: true
                }}
              />
              <p className={this.state.style.text}>
                <i>
                  Online compiler does not support bigBang, download the .java
                  file and run in Eclipse.
                </i>
                <br />
              </p>
            </Col>
            <Col xs='5' className={`pl-2`}>
              <CodeMirror
                value={this.state.output}
                options={{
                  lineWrapping: true,
                  readOnly: 'nocursor',
                  scrollbarStyle: null,
                  theme: this.state.theme
                }}
              />
              <p className={this.state.style.text}>
                <i>Press Ctrl+R to Compile & Run</i>
              </p>
            </Col>
          </Row>
          <Row>
            <Col></Col>
            <Col></Col>
          </Row>
        </Col>
      </div>
    )
  }
}

export default IDE
