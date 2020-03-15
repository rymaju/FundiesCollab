import React from 'react'
import { Route, BrowserRouter, Switch } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import 'bootstrap/dist/css/bootstrap.min.css'

import IDE from './components/IDE.component'
import NotFound from './components/NotFound.component'
import Home from './components/Home.component'

function App () {
  return (
    <div>
      <Helmet>
        <meta charSet='utf-8' />
        <title>FundiesCollab</title>
        <meta
          name='description'
          content='Collaborative Real-Time coding in Java using the Fundies 2 Tester
              and Image libraries.'
        />
      </Helmet>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/room/:id' component={IDE} />
          <Route exact path='*' component={NotFound} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default App
