/* eslint-disable no-underscore-dangle, no-param-reassign */
import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'

import './styles.less'

export default class DimmingLoader extends React.Component {
  state = {
    loadingActive: false
  }

  componentDidUpdate(prevProps) {
    // Delay loading indicator based on delay prop
    if (!prevProps.loading && this.props.loading && !this.state.loadingActive) {
      setTimeout(() => {
        if (this.props.loading && !this.state.loadingActive) {
          this.setState({ loadingActive: true })
        }
      }, this.props.delay || 0)
    } else if (prevProps.loading && !this.props.loading && this.state.loadingActive) {
      this.setState({ loadingActive: false })
    }
  }

  render() {
    const { loadingActive } = this.state
    return (
      <Dimmer.Dimmable dimmed={loadingActive}>
        <Dimmer active={loadingActive} inverted>
          <Loader className="common-dimming-loader" active={loadingActive} size="massive">
            Loading
          </Loader>
        </Dimmer>
        {this.props.children}
      </Dimmer.Dimmable>
    )
  }
}
