import React, { Component } from 'react'
import Settings from './Settings'
import Repo from './Repo'

class OrganizationDetails extends Component {
  render () {
    return (
      <React.Fragment>
        <h1 className='display-2 text-center'>{this.props.name}</h1>

        {this.props.isAdmin && (
          <Settings org={this.props.name} user={this.props.user} />)
        }

        <h1 className='display-4 text-center'>Repos</h1>
        <div className='row'>
          {this.props.repos.map(repo => {
            return (
              <Repo key={repo.name} {...repo} />
            )
          })}
        </div>

      </React.Fragment>
    )
  }
}

export default OrganizationDetails
