import React from 'react'
import { Icon, Header, Modal, Step } from 'semantic-ui-react'

const UploadModal = ({ children, open, loading }) => (
  <Modal open={open}>
    <Header content="Import CSV" />
    <Step.Group attached="bottom">
      <Step active={!loading}>
        <Icon name="settings" />
        <Step.Content>
          <Step.Title>Mapping</Step.Title>
          <Step.Description>Configure Data Mapping</Step.Description>
        </Step.Content>
      </Step>

      <Step active={loading}>
        <Icon name="history" />
        <Step.Content>
          <Step.Title>Processing</Step.Title>
          <Step.Description>Automatic Data Processing</Step.Description>
        </Step.Content>
      </Step>
    </Step.Group>
    <Modal.Content scrolling>{children}</Modal.Content>
  </Modal>
)

export default UploadModal
