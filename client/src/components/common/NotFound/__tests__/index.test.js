import React from 'react'
import { shallow } from 'enzyme'
import NotFound from '../index'

describe('Not Found Component', () => {
  let props
  let mountedComponent
  const component = () => {
    if (!mountedComponent) {
      mountedComponent = shallow(<NotFound {...props} />)
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
