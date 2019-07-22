import React from 'react'
import { render } from 'react-dom'
import { Route, BrowserRouter } from 'react-router-dom'

import App from './components/App'

import './styling/globalStyles.less'
import './styling/semantic.less'

render(
  <BrowserRouter>
    <Route path="/" component={App} />
  </BrowserRouter>,
  document.getElementById('app')
)
