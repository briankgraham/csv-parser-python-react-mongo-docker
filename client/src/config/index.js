import merge from 'lodash/merge'
import defaultConfig from './default'
import productionConfig from './production'
import stagingConfig from './staging'

let tmp = defaultConfig
if (STAGE === 'staging') {
  tmp = merge(defaultConfig, stagingConfig)
} else if (STAGE === 'production') {
  tmp = merge(defaultConfig, productionConfig)
}
const config = tmp
export default config
