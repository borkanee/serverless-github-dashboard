import React, { Component } from 'react'

class Organization extends Component {
  render () {
    return (
      <React.Fragment>
        <div className='card' >
          <img className='card-img-top' alt='organization avatar' src={this.props.avatarURL} />
          <div className='card-body d-flex flex-column'>
            <h5 className='card-title text-center'>{this.props.name}</h5>
            <p className='card-text'>{this.props.description}</p>
            <a href='#' name={this.props.name} onClick={this.props.displayDetails} className='btn btn-light mt-auto text-center'>DETAILS</a>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Organization
