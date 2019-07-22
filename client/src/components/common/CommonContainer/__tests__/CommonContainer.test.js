import React from 'react'
import { shallow } from 'enzyme'
import CommonContainer from '../index'

describe('Common Container Component', () => {
  let props
  let mountedComponent
  const component = () => {
    if (!mountedComponent) {
      mountedComponent = shallow(<CommonContainer {...props} />)
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
