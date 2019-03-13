import React, { Component } from 'react'

class Repo extends Component {
  render () {
    return (
      <React.Fragment>
        <div className='card text-center col-sm-6'>
          <div className='card-header' />
          <div className='card-body'>
            <h5 className='card-title'>{this.props.name}</h5>
            <p className='card-text'>{this.props.description}</p>
            <a href={this.props.URL} target='_blank' className='btn btn-primary'>{this.props.name} on GitHub</a>
          </div>
          <div className='card-footer text-muted' />
        </div>
      </React.Fragment>
    )
  }
}

export default Repo
