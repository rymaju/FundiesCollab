import React, { Component } from 'react'
import axios from 'axios'
import { Controlled as CodeMirror } from 'react-codemirror2'
import '../theme/eclipse.css'
import '../theme/dracula.css'
import '../theme/material-palenight.css'

import lightMode from './Light.module.css'
import darkMode from './Dark.module.css'

import { Helmet } from 'react-helmet'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import exampleCode from './exampleCode'
import {
  Button,
  ButtonGroup,
  Spinner,
  Label,
  Input,
  Row,
  Col,
  UncontrolledAlert,
  InputGroup,
  InputGroupAddon
} from 'reactstrap'
import hexToRgba from 'hex-to-rgba'
const fileDownload = require('js-file-download')

require('./custom-codemirror.css')
require('codemirror/addon/edit/closebrackets')
require('codemirror/addon/edit/matchbrackets')
require('codemirror/addon/display/rulers')
require('codemirror/addon/selection/active-line')
require('codemirror/addon/search/match-highlighter')
require('codemirror/mode/clike/clike')

const io = require('socket.io-client')
const socket = io()

class Room extends Component {
  constructor () {
    super()

    // Use any hex color code here, these are the colors
    // of other users' cursers
    this.cursors = [
        "#ef5350",
        "#42A5F5",
        "#81C784",
        "#9575CD",
        "#FF7043",
        "#4DD0E1",
        "#4DB6AC"
    ]

    this.state = {
      fileName: 'Foo.java',
      examplesClasses: ['ExamplesFoo'],
      javaCode: exampleCode,
      output: 'Press "Compile" or hit Ctrl+R to run your code!',
      disableButton: false,
      roomId: '',
      keyPressState: false,
      theme: 'eclipse',
      style: lightMode,
      cursors: {},
      myColor: "red"
    }

    window.addEventListener("beforeunload", function(evt) {
      socket.emit('remove cursor', {
        room: this.state.roomId,
        color: this.state.myColor
      })
    
      // Google Chrome requires returnValue to be set
      evt.returnValue = '';
    
      return null;
    }.bind(this));

    socket.on('sync code', payload => {
      this.setState({ javaCode: payload.newCode })
    })
    socket.on('remove cursor', payload => {
      if (this.state.cursors[payload.color] !== undefined) {
        this.state.cursors[payload.color].clear();
        this.state.cursors[payload.color] = undefined;
      }
    })
    socket.on('new client number', payload => {
      this.setState({ myColor: this.cursors[payload.clientNum % this.cursors.length] })
    })

    this.handleFileChange = this.handleFileChange.bind(this)
    this.handleExamplesChange = this.handleExamplesChange.bind(this)
    this.handleCodeChange = this.handleCodeChange.bind(this)
    this.compile = this.compile.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.download = this.download.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.handleCursorMove = this.handleCursorMove.bind(this)

    document.body.addEventListener('keydown', this.handleKeyDown)
    document.body.addEventListener('keyup', this.handleKeyUp)
  }

  handleCursorMove (cm, color, cursor) {
    // cm: CodeMirror instance
    // color: the color of the cursor to update
    // cursor: The position of the cursor sent from another client ({line, ch} about CodeMirror)
      
    if (this.state.cursors[color] !== undefined) {
      this.state.cursors[color].clear();
    }
        
    // Generate DOM node (marker / design you want to display)
    const cursorCoords = cm.cursorCoords(cursor);
    const cursorElement = document.createElement('span');
    cursorElement.className = "custom-cursor"
    cursorElement.style.borderLeftStyle = 'solid';
    cursorElement.style.borderLeftWidth = '2px';
    cursorElement.style.borderLeftColor = color;
    cursorElement.style.height = `${(cursorCoords.bottom - cursorCoords.top)}px`;
    cursorElement.style.padding = 0;
    cursorElement.style.zIndex = 0;
    cursorElement.style.boxShadow = "0px 0px 10px 5px " + hexToRgba(color, 0.2);;

    // Set the generated DOM node at the position of the cursor sent from another client
    // setBookmark first argument: The position of the cursor sent from another client
    // Second argument widget: Generated DOM node
    var marker = cm.setBookmark(cursor, { widget: cursorElement });

    var newCursors = Object.assign({}, this.state.cursors);
    newCursors[color] = marker;
    this.setState({ cursors: newCursors })
  }

  handleFileChange (event) {
    this.setState({ fileName: event.target.value })
  }

  handleExamplesChange (event) {
    this.setState({ examplesClasses: event.target.value.split(' ') })
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

    axios
      .post(
        process.env.NODE_ENV === 'production'
          ? 'https://fundiescollab.com/api/compile/java'
          : 'http://localhost:5000/api/compile/java',
        {
          fileName: this.state.fileName,
          examplesClasses: this.state.examplesClasses,
          javaCode: this.state.javaCode,
          roomId: this.state.roomId
        }
      )
      .then(response => {
        const output = response.data.out

        this.setState({
          output,
          disableButton: false
        })
      })
      .catch(error => {
        console.log(error.response.data.err)
        if (error.response.data.err === undefined) {
          this.setState({
            output:
              'We cant seem to connect to our servers, sorry! In the meantime, you can download your code and work offline.',
            disableButton: false
          })
        } else if (error.response.status === 507) {
          this.setState({
            output: 'Uh oh, it looks like our servers are at max capacity! Your work cannot be compiled or saved. Email me at ryan.matthew.jung@gmail.com to let me know there\'s a problem.In the meantime, you can download your code and work offline.',
            disableButton: false
          })
        } else if (error.response.data.err === 'Java execution timed out') {
          this.setState({
            output:
              'Your code took way too long to execute! Look for infinite loops or recursion and try again.',
            disableButton: false
          })
        } else if (error.response.status === 500) {
          this.setState({
            output: 'Yikes, something went wrong with our servers. Sorry! Email me at ryan.matthew.jung@gmail.com to let me know there\'s a problem. In the meantime, you can download your code and work offline.',
            disableButton: false
          })
        } else {
          this.setState({
            output:
              'Oops! There was a problem processing your request. Please wait 60 seconds and try again.',
            disableButton: false
          })
        }
      })
  }

  componentDidMount () {
    this.setState({ roomId: this.props.match.params.id }, () => {
      socket.emit('join room', { room: this.state.roomId })
    })
  }

  componentWillUnmount () {
    socket.emit('leave room', {
      room: this.state.roomId
    })
  }

  render () {
    return (
      <div>
        <Helmet>
          <title>FundiesCollab | {this.state.roomId}</title>
        </Helmet>

        <div className={this.state.style.IDEContainer}>
          <Col>
            <Row>
              <Col>
                <UncontrolledAlert size='sm' color='danger'>
                  Rooms automatically save your work. However, after 7 days of
                  inactivity your room will be deleted, so remember to download
                  your code when you're done!
                </UncontrolledAlert>
                <Row>
                  <Col xs='5'>
                    <Label className={this.state.style.text}>Name </Label>
                    <Input
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
                      id='file'
                      size='40'
                      type='text'
                      onChange={this.handleExamplesChange}
                      value={this.state.examplesClasses}
                      spellCheck='false'
                    />
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <Col md='7' className='pr-2'>
                <div className='d-flex justify-content-between mt-3 mb-3'>
                  <div
                    className='d-flex flex-row'
                    style={{
                      height: '40px'
                    }}
                  >
                    <ButtonGroup>
                      <Button
                        color='success'
                        size='sm'
                        disabled={this.state.disableButton}
                        onClick={() => this.compile()}
                        style={{
                          width: '80px'
                        }}
                      >
                        Compile
                      </Button>

                      <Button
                        outline
                        color='success'
                        size='sm'
                        disabled={this.state.disableButton}
                        onClick={() => this.download()}
                        style={{
                          width: '125px'
                        }}
                      >
                        Download Code
                      </Button>
                    </ButtonGroup>
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
                  </div>
                  {this.state.disableButton && (
                    <Spinner size='md' color='primary' />
                  )}
                </div>
                <CodeMirror
                  value={this.state.javaCode}
                  onCursorActivity={(editor) => {
                      var { line, ch } = editor.getCursor();

                      socket.emit('send cursor', {
                        room: this.state.roomId,
                        color: this.state.myColor,
                        cursor: { line, ch }
                      })
                  }}
                  
                  editorDidMount = {(editor) => {
                    socket.on('cursor move', payload => {
                      this.handleCursorMove(editor, payload.color, payload.cursor);
                    })
                  }}
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
                    theme: this.state.theme,
                    styleActiveLine: true,
                    highlightSelectionMatches: true
                  }}
                />
              </Col>
              <Col md='5' className='pl-2'>
                <div className='d-flex flex-row mt-3 mb-3'>
                  <InputGroup size='sm'>
                    <Input
                      readOnly='true'
                      style={{ height: '40px' }}
                      value={`FundiesCollab.com${this.props.location.pathname}`}
                    />
                    <InputGroupAddon addonType='append'>
                      <CopyToClipboard
                        text={`FundiesCollab.com${this.props.location.pathname}`}
                      >
                        <Button color='primary' size='sm'>
                          Copy Link
                        </Button>
                      </CopyToClipboard>
                    </InputGroupAddon>
                  </InputGroup>
                </div>
                <CodeMirror
                  value={this.state.output}
                  options={{
                    lineWrapping: true,
                    readOnly: false,
                    scrollbarStyle: null,
                    theme: this.state.theme
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <p className={`${this.state.style.text} mt-3`}>
                  <i>FundiesCollab v0.9.2 </i>
                  <p>Created by Ryan Jung @ Northeastern University</p>

                  <a href='https://github.com/rymaju/FundiesCollab'>Github</a>
                  {' | '}
                  <a href='https://course.ccs.neu.edu/cs2510/Documentation.html'>
                    Image & Tester Library Docs
                  </a>
                  {' | '}
                  <a href='https://course.ccs.neu.edu/cs2510/'>
                    Fundies 2 Homepage
                  </a>
                </p>{' '}
              </Col>
            </Row>
          </Col>
        </div>
      </div>
    )
  }
}

export default Room
