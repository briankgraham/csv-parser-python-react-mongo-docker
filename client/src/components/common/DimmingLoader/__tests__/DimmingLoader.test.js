import React from 'react'
import { shallow } from 'enzyme'
import DimmingLoader from '../index'

describe('Dimmable Loader Component', () => {
  let props
  let mountedComponent
  const component = () => {
    if (!mountedComponent) {
      mountedComponent = shallow(<DimmingLoader {...props} />)
    }
    return mountedComponent
  }

  beforeEach(() => {
    props = {}
    mountedComponent = undefined
  })

  it('always renders a component', () => {
    expect(component()).toHaveLength(1)
  })
})
