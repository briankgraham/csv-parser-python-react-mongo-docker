import React from 'react'

import { Container, Header } from 'semantic-ui-react'

export default () => (
  <div>
    <Container style={{ padding: '2rem' }} textAlign="center">
      <Header as="h2" style={{ marginTop: '6rem' }}>
        Oops! We can't find this page (404)
      </Header>
    </Container>
  </div>
)
