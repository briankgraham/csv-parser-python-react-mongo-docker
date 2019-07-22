import React from 'react'
import { Container } from 'semantic-ui-react'

const CommonContainer = ({ children, style = {} }) => (
  <Container text style={{ maxHeight: '100vh', height: '100%', ...style }}>
    {children}
  </Container>
)

export default CommonContainer
