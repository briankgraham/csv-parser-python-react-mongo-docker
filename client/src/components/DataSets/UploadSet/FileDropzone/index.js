import React, { Fragment } from 'react'

import Dropzone from 'react-dropzone'

const FileDropzone = ({ onDrop }) => (
  <Fragment>
    <Dropzone
      onDrop={(acceptedFiles, rejectedFiles) => onDrop(acceptedFiles, rejectedFiles)}
      className="ui icon message upload-dropzone"
      activeClassName="ui icon blue message upload-dropzone-active">
      <i className="csv file outline icon" />
      <div className="content">
        <div className="header">Upload CSV</div>
        <p>Try dropping a file here, or click to select a file to upload.</p>
      </div>
    </Dropzone>
  </Fragment>
)

export default FileDropzone
