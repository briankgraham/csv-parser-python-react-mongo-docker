// NOTE: Used for code-splitting, see App/index for usage
import React from 'react'
import Loadable from 'react-loadable'
import { Dimmer, Loader } from 'semantic-ui-react'

// TODO: Need a pretty loading component.
const Loading = ({ pastDelay }) =>
  pastDelay && (
    <Dimmer active inverted>
      <Loader size="massive">Loading</Loader>
    </Dimmer>
  )

// default delay is 200 ms
export default componentToImport => Loadable({ loader: componentToImport, loading: Loading })
