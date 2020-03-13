import React from 'react'
import './App.css'
import {
  Router,
  Route,
  Link,
  BrowserRouter,
  Redirect,
  Switch
} from 'react-router-dom'

import IDE from './components/IDE.component'
import NotFound from './components/NotFound.component'
import Home from './components/Home.component'

function App () {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/room/:id' component={IDE} />
        <Route exact path='*' component={NotFound} />
      </Switch>
    </BrowserRouter>
  )
}

export default App
