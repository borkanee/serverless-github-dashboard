import React, { Component } from 'react'

class Organization extends Component {
  render () {
    return (
      <React.Fragment>
        <div className='card' style={{ width: '18rem' }}>
          <img className='card-img-top' src={this.props.avatarURL} />
          <div className='card-body'>
            <h5 className='card-title'>{this.props.name}</h5>
            <p className='card-text'>{this.props.description}</p>
            <a href='#' value={this.props.name} onClick={this.props.displayDetails} className='card-link'>Details</a>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Organization
