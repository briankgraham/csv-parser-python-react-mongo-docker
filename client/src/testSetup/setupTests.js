/* eslint-disable */
// setup file
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

// NOTE: taken from http://airbnb.io/enzyme/docs/guides/jsdom.html
const { JSDOM } = require('jsdom')

const jsdom = new JSDOM('<!doctype html><html><body></body></html>')
const { window } = jsdom

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .reduce(
      (result, prop) => ({
        ...result,
        [prop]: Object.getOwnPropertyDescriptor(src, prop)
      }),
      {}
    )
  Object.defineProperties(target, props)
}

global.window = window
global.window.scrollTo = () => true
global.document = window.document
global.localStorage = { getItem: () => true, setItem: () => true }
global.navigator = {
  userAgent: 'node.js'
}
global.STAGE = ''
global.DEV_HOSTNAME = ''

copyProps(window, global)

configure({ adapter: new Adapter() })
