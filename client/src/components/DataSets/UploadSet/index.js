import React, { Component } from 'react'

import { withRouter } from 'react-router-dom'

import Dropzone from 'react-dropzone'
import Papa from 'papaparse'

import chunk from 'lodash/chunk'
import flatten from 'lodash/flatten'
import get from 'lodash/get'
import axios from 'axios'
import { Button, Dropdown, Form, Icon, Header, Message, Modal, Progress, Step } from 'semantic-ui-react'

import Container from '../../common/CommonContainer'
import Transition from '../../common/Transition'

import { columnMappings } from './fileMappings'

import './styles.less'

const mapFormDataToState = formMap => flatten(formMap).reduce((acc, { name }) => ({ ...acc, [name]: name }), {})

const REQUIRED_MAPPING_COUNT = columnMappings.length
const BATCH_REQUEST_SIZE = 5

class CsvUploader extends Component {
  state = {
    modalOpen: false,
    mappingStore: mapFormDataToState(columnMappings),
    headers: [],
    mappings: {},
    people: [],
    peopleSaved: 0,
    loading: false,
    error: null,
    uploadMore: false,
    uploadStatus: '',
    file: []
  }

  papaParseConfig = {
    complete: async (res, file) => {
      const [columnNames, ...people] = res.data
      const mappings = { ...this.state.mappings }
      const headers = columnNames.map(val => {
        if (this.state.mappingStore[val]) {
          mappings[val] = val
        }
        return {
          key: val,
          text: val,
          value: val
        }
      })
      window.URL.revokeObjectURL(file.preview)
      this.setState({
        modalOpen: true,
        headers,
        mappings,
        people,
        fileName: file.name
      })
    }
  }

  addFileToState = files => {
    files.forEach(file => {
      Papa.parse(file, this.papaParseConfig)
    })
  }

  drop(acceptedFiles, rejectedFiles) {
    const error = this.handleDropErrors(acceptedFiles, rejectedFiles)
    this.setState({ error })
    if (error) return

    // Ignore XLS files for now
    if (!/.xls/.test(acceptedFiles[0].name)) {
      this.addFileToState(acceptedFiles)
    }

    this.setState({ uploadMore: false })
  }

  handleDropErrors(acceptedFiles, rejectedFiles) {
    let error = null
    if (rejectedFiles.length) {
      error = new Error(`File did not meet criteria: ${rejectedFiles[0].name}`)
    }

    if (acceptedFiles.length > 1) {
      error = new Error('You tried to upload more than 1 file')
    }

    const [{ name: fileName }] = acceptedFiles

    if (!/.csv/.test(fileName)) {
      error = new Error('You tried to upload a file that is not CSV format')
    }

    return error
  }

  onDropdownChange = (e, { name, value }) => {
    const mappings = { ...this.state.mappings }
    // remove old key/value pair if its already assigned
    const key = Object.keys(this.state.mappings).reduce((foundName, key) => {
      if (this.state.mappings[key] === name) return key
      return foundName
    }, false)
    if (key) {
      delete mappings[key]
    }
    this.setState({ mappings: { ...mappings, [value]: name } })
  }

  onSubmit = async () => {
    const { fileName, headers, people, mappings } = this.state
    const peopleFromFile = []
    let error
    const headerStore = headers.reduce((store, columnName, idx) => {
      const colName = columnName
      // eslint-disable-next-line no-param-reassign
      store[idx] = colName
      return store
    }, {})

    // Ignore duplicates via their email or phone number
    // Add unique people to peopleFromFile array
    people.reduce((lookupStore, person) => {
      const peep = person.reduce((rows, column, i) => {
        const header = headerStore[i]
        if (header.value && mappings[header.value]) {
          // eslint-disable-next-line no-param-reassign
          rows[mappings[header.value]] = column || null
        }
        return rows
      }, {})

      const uniqueIdentifier = peep.email || peep.phone_number
      if (!uniqueIdentifier) {
        error = new Error('Need a unique Identifier like an email, or phone_number')
        return lookupStore
      }

      if (!lookupStore[uniqueIdentifier]) {
        // eslint-disable-next-line no-param-reassign
        lookupStore[uniqueIdentifier] = peep
        peopleFromFile.push(peep)
      }

      return lookupStore
    }, {})

    // Create DataSet
    // Then add people to it
    this.setState({ error, loading: !error }, async () => {
      const dataSet = await this.uploadDataSet(fileName)

      if (get(dataSet, 'data.errors')) {
        return this.setState({ error: new Error(dataSet.errors) })
      }

      const dataSetId = get(dataSet, 'data.result._id')
      if (dataSetId) {
        await this.uploadPeople(peopleFromFile, dataSetId)
        // TODO: uploadStatus === 'complete' at this point, or show errors
      }
    })
  }

  uploadDataSet = async title =>
    axios({
      method: 'post',
      url: 'http://localhost:9911/1/data_sets',
      data: { title }
    })

  uploadPeople = async (people, dataSetId) => {
    const size = BATCH_REQUEST_SIZE
    const batches = chunk(people, size)

    // using a for of loop to allow sequence processing of the requests
    // the reason eslint doesnt like it is because eslint is smart enough to analayze how it works
    // eslint-disable-next-line no-restricted-syntax
    for (const batch of batches) {
      // I am avoiding too many request (doing in batches of 5) at the same time to same domain
      // because browser limits (there is limits to how many requests per domain)
      const promises = batch.map(this.uploadPersonMapFunc(dataSetId))
      // https://eslint.org/docs/rules/no-await-in-loop#when-not-to-use-it
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(promises)
    }
  }

  uploadPersonMapFunc = dataSetId => async person => this.uploadPerson(person, dataSetId)

  uploadPerson = async (person, dataSetId) => {
    await axios({
      method: 'post',
      url: `http://localhost:9911/1/data_sets/${dataSetId}/people`,
      data: { fields: person }
    })
    const peopleSaved = this.state.peopleSaved + 1
    if (peopleSaved === this.state.people.length) {
      this.setState({ uploadStatus: 'complete', loading: false })
      this.props.history.push(`/data-sets/${dataSetId}`)
    } else {
      this.setState({ peopleSaved })
    }
  }

  renderItemsOrUpload() {
    const { headers, fileName, mappings, uploadStatus, uploadMore } = this.state
    const uploadIsComplete = uploadStatus === 'complete'
    const fileExists = !!fileName
    if (fileExists && !uploadMore) {
      return (
        <div>
          <React.Fragment>
            <Transition>
              <Message icon="checkmark" header={`${fileName} staged for upload`} />
            </Transition>
            {uploadIsComplete && <div>Upload Complete!</div>}
          </React.Fragment>
          {uploadIsComplete && (
            <Transition>
              <Button
                onClick={() => {
                  this.setState({ uploadMore: true })
                  this.resetUploadState()
                }}>
                Upload More
              </Button>
            </Transition>
          )}
          <Transition>
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
                          onChange={this.onDropdownChange}
                          defaultValue={name}
                        />
                      </Form.Input>
                    ) : null
                  )}
                </Form.Group>
              ))}
            </React.Fragment>
          </Transition>
          {Object.keys(mappings).length === REQUIRED_MAPPING_COUNT && !uploadIsComplete && (
            <Transition>
              <Button style={{ marginTop: '1.2rem' }} color="red" onClick={this.onSubmit}>
                Upload
              </Button>
            </Transition>
          )}
        </div>
      )
    }

    return (
      <div>
        <Dropzone
          onDrop={(acceptedFiles, rejectedFiles) => this.drop(acceptedFiles, rejectedFiles)}
          className="ui icon message upload-dropzone"
          activeClassName="ui icon blue message upload-dropzone-active">
          <i className="csv file outline icon" />
          <div className="content">
            <div className="header">Upload CSV</div>
            <p>Try dropping a file here, or click to select a file to upload.</p>
          </div>
        </Dropzone>
      </div>
    )
  }

  render() {
    const { error, loading, modalOpen, peopleSaved, people } = this.state
    return (
      <React.Fragment>
        <Container>
          <Header style={{ marginTop: '2rem' }} icon="upload" content="Import People For Your Rolodex" />
          {error && <Message error content={error.message} />}
          {this.renderItemsOrUpload()}
        </Container>
        <Modal open={modalOpen}>
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
          <Modal.Content scrolling>
            {error && <Message error content={error.message} />}
            {loading ? (
              <Transition>
                <Progress active color="blue" percent={(peopleSaved / people.length) * 100} label="Importing" />
              </Transition>
            ) : (
              this.renderItemsOrUpload()
            )}
          </Modal.Content>
        </Modal>
      </React.Fragment>
    )
  }
}

export default withRouter(CsvUploader)
