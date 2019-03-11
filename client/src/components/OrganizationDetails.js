import React, { Component } from 'react'
import Settings from './Settings'
import Repo from './Repo'

class OrganizationDetails extends Component {
  render () {
    return (
      <React.Fragment>
        <h3 className='display-4'>{this.props.name}</h3>

        <Settings org={this.props.name} user={this.props.user} />

        {this.props.repos.map(repo => {
          return (
            <Repo key={repo.name} {...repo} />
          )
        })}

      </React.Fragment>
    )
  }
}

export default OrganizationDetails
