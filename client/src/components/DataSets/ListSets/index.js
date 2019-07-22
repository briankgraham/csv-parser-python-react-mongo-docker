import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Header, Table } from 'semantic-ui-react'
import Container from '../../common/CommonContainer'

const useEndpoint = req => {
  const [res, setRes] = useState({
    dataSet: null,
    people: null,
    complete: false,
    loading: false,
    error: false
  })
  useEffect(() => {
    async function fetchDataSet() {
      try {
        const [dataSet, people] = await Promise.all([axios(req), axios({ ...req, url: `${req.url}/people` })])
        setRes({
          dataSet: dataSet.data.result,
          people: people.data.result,
          loading: false,
          error: false,
          complete: true
        })
      } catch (e) {
        setRes({
          dataSet: null,
          people: null,
          loading: false,
          error: true,
          complete: true
        })
      }
    }
    setRes({
      dataSet: null,
      people: null,
      loading: true,
      error: false,
      complete: false
    })
    fetchDataSet()
  }, [req.url])
  return res
}

export default function ListSets({ match }) {
  const dataSetApi = `http://localhost:9911/1/data_sets/${match.params.id}`
  const dataSetState = useEndpoint({
    method: 'GET',
    url: dataSetApi
  })
  return (
    <React.Fragment>
      {dataSetState.loading && <Container>Loading...</Container>}
      {dataSetState.complete && dataSetState.dataSet.title && (
        <Container style={{ marginTop: '2rem' }}>
          <Header>Rolodex File: {dataSetState.dataSet.title}</Header>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>First Name</Table.HeaderCell>
                <Table.HeaderCell>Last Name</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {dataSetState.people.map(({ email, first_name, last_name }) => (
                <Table.Row key={email}>
                  <Table.Cell>{email}</Table.Cell>
                  <Table.Cell>{first_name}</Table.Cell>
                  <Table.Cell>{last_name}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Container>
      )}
    </React.Fragment>
  )
}
