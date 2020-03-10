import React, { Component } from 'react'
import axios from 'axios'
class IDE extends Component {
  constructor () {
    super()
    this.state = {
      fileName: 'Foo.java',
      examplesClasses: ['ExamplesFoo'],
      javaCode: `import tester.Tester;
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
}

class ExamplesFoo {
  void testFoo(Tester t) {
    t.checkExpect(new Foo(1, 2).add(), 3);
  }
}
`,
      output: '',
      disableButton: false
    }
    this.handleFileChange = this.handleFileChange.bind(this)
    this.handleExamplesChange = this.handleExamplesChange.bind(this)
    this.handleCodeChange = this.handleCodeChange.bind(this)
    this.compile = this.compile.bind(this)
  }

  handleFileChange (event) {
    this.setState({ fileName: event.target.value })
    console.log(this.state)
  }
  handleExamplesChange (event) {
    this.setState({ examplesClasses: event.target.value.split(' ') })
    console.log(this.state)
  }
  handleCodeChange (event) {
    this.setState({ javaCode: event.target.value })
    console.log(this.state)
  }

  compile () {
    this.setState({
      output: 'Running code... Please wait while we run your tests',
      disableButton: true
    })

    axios
      .post('https://fundies.herokuapp.com/api/compile/java', {
        fileName: this.state.fileName,
        examplesClasses: this.state.examplesClasses,
        javaCode: this.state.javaCode
      })
      .then(response => {
        console.log(response.data)
        this.setState({
          output: response.data,
          disableButton: false
        })
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

  render () {
    return (
      <div>
        <div>
          <label>Name</label>
          <br />
          <input
            id='file'
            type='text'
            onChange={this.handleFileChange}
            value={this.state.fileName}
            spellcheck='false'
          ></input>
        </div>
        <div>
          <label>Examples</label>
          <br />
          <input
            id='file'
            type='text'
            onChange={this.handleExamplesChange}
            value={this.state.examplesClasses}
            spellcheck='false'
          ></input>
        </div>
        <div>
          <label>Code</label>
          <br />
          <textarea
            id='file'
            type='text'
            rows='20'
            cols='100'
            onChange={this.handleCodeChange}
            spellcheck='false'
          >
            {this.state.javaCode}
          </textarea>
        </div>
        <button
          disabled={this.state.disableButton}
          onClick={() => this.compile()}
        >
          Compile
        </button>

        <p style={{ whiteSpace: 'pre-wrap' }}>{this.state.output}</p>
      </div>
    )
  }
}

export default IDE
