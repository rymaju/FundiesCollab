import React from 'react'
import './App.css'
import { Route, BrowserRouter, Switch } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'

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
