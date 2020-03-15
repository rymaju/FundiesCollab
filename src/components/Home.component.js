import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Jumbotron, Button, Container, Row, Col, Input } from 'reactstrap'
const Haikunator = require('haikunator')
const haikunator = new Haikunator()

class Home extends Component {
  generateRoomId () {
    return haikunator.haikunate({ tokenLength: 4 })
  }

  render () {
    return (
      <div>
        <Jumbotron>
          <Container>
            <div className='d-flex flex-row'>
              <h1 className='display-3'>FundiesCollab</h1>{' '}
              <img
                className='ml-3'
                height={`90px`}
                src={'/check-plus.png'}
                alt=''
              />
            </div>
            <p className='lead'>
              Collaborative Real-Time Coding in Java using the Fundies 2 Tester
              and Image libraries.
            </p>
            <hr className='my-2' />
            <p>Share code, pair program, and test as you go.</p>
            <div className='input-group'>
              <Link to={`/room/${this.generateRoomId()}`}>
                <Button size='lg' color='primary'>
                  Start Coding
                </Button>
              </Link>
            </div>
          </Container>
        </Jumbotron>
        <Container>
          <Row>
            <Col>
              <h3>Real-Time Collaboration</h3>
              <p>
                FundiesCollab allows you to code with other people at the same
                time on the same document. Coding partners can remotely
                contribute to a single file and easily share code. No more
                messing around with git or inconvient forms of file sharing,
                simply open up your browser to start working together and
                download your code when you're done.
              </p>
            </Col>
            <Col>
              <h3>Save and Share Online</h3>
              <p>
                When you work on FundiesCollab, you jump into a random room. You
                can easily share the room to collaborate with others simply by
                sharing the link in your browser! The code in your room can be
                stored for up to 7 days after your last edit.
              </p>
            </Col>
            <Col>
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
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default Home
