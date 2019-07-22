import React from 'react'

import { Transition } from 'react-transition-group'

const duration = 500

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0
}

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 }
}

class BasicTransition extends React.Component {
  state = {
    // toggleTransition: false
  }

  componentDidMount() {
    if (this.props.active === undefined) this.setState({ toggleTransition: true })
  }

  componentWillUnmount() {
    this.setState({ toggleTransition: false })
  }

  render() {
    return (
      <Transition
        in={Object.hasOwnProperty.call(this.state, 'toggleTransition') ? this.state.toggleTransition : this.props.active}
        timeout={5}>
        {state => <div style={{ ...defaultStyle, ...transitionStyles[state] }}>{this.props.children}</div>}
      </Transition>
    )
  }
}

export default BasicTransition
