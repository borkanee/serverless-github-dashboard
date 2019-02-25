import React, { Component } from 'react'
import Settings from './Settings'

class OrganizationDetails extends Component {
  render () {
    return (
      <React.Fragment>
        <h3 className='display-4'>{this.props.name}</h3>

        <Settings org={this.props.name} user={this.props.user} token={this.props.token} />
      </React.Fragment>
    )
  }
}

export default OrganizationDetails
