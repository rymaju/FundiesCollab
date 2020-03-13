import React, { Component } from 'react'
import { Link } from 'react-router-dom'
class Home extends Component {
  render () {
    return (
      <div>
        <p>
          Welcome to FundiesCollab, an interactive online editor and compiler.
        </p>

        <Link to={'/room/123'}>Take me to a random room!</Link>
      </div>
    )
  }
}

export default Home
