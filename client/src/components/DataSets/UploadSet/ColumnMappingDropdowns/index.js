import React, { Fragment } from 'react'
import { Dropdown, Form, Header } from 'semantic-ui-react'

import { columnMappings } from '../fileMappings'

const ColumnMappingDropdowns = ({ headers, onDropdownChange }) => (
  <React.Fragment>
    <Header style={{ marginTop: '2rem' }} content="Required Mappings" />
    {columnMappings.map((mappings, index) => (
      <Form.Group key={`key-${index}`}>
        {(!Array.isArray(mappings) ? [mappings] : mappings).map(({ label, name }) =>
          headers.length ? (
            <Form.Input fluid label={label} key={label}>
              <Dropdown
                fluid
                key={index}
                selection
                labeled
                options={headers}
                label={label}
                name={name}
                onChange={onDropdownChange}
                defaultValue={name}
              />
            </Form.Input>
          ) : null
        )}
      </Form.Group>
    ))}
  </React.Fragment>
)

export default ColumnMappingDropdowns
