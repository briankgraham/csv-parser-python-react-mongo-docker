import React from 'react'
import { Redirect, Route, Switch, withRouter } from 'react-router-dom'
import AsyncLoadComponent from '../common/AsyncLoadComponent'

import NotFound from '../common/NotFound'

import './styles.less'

const AsyncUploader = AsyncLoadComponent(() => import('../DataSets/UploadSet'))
const AsyncListDataSets = AsyncLoadComponent(() => import('../DataSets/ListSets'))

const App = () => (
  <div className="app-container">
    <Switch>
      <Route path="/home" component={AsyncUploader} />
      <Route path="/data-sets/:id" component={AsyncListDataSets} />
      <Route path="/404" render={NotFound} />

      <Route path="/" exact component={() => <Redirect to={{ pathname: '/home' }} />} />
      <Route component={NotFound} />
    </Switch>
  </div>
)

export default withRouter(App)
