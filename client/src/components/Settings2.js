import React, { Component } from 'react'

class Settings extends Component {
  render () {
    return (
      <React.Fragment>
        <div className='row justify-content-center'>
          <div className='form-group'>
            <label for='sel1'>Choose Organization:</label>
            <select className='form-control' id='sel1'>
              {this.props.organizations.map(org => {
                return (
                  <option>{org}</option>
                )
              })}
            </select>
          </div>
        </div>
        <div className='container'>
          <div className='row'>
            <div className='col-md-6'>
              <div className='card' style={{ margin: '50px 0' }}>
                <ul className='list-group list-group-flush'>
                  <li className='list-group-item'>
                    Repositories
                    <label className='switch '>
                      <input type='checkbox' className='success' />
                      <span className='slider round' />
                    </label>
                  </li>
                  <li className='list-group-item'>
                    Commits
                    <label className='switch '>
                      <input type='checkbox' className='success' />
                      <span className='slider round' />
                    </label>
                  </li>
                  <li className='list-group-item'>
                    Issue comments
                    <label className='switch '>
                      <input type='checkbox' className='success' />
                      <span className='slider round' />
                    </label>
                  </li>
                  <li className='list-group-item'>
                    Projects
                    <label className='switch '>
                      <input type='checkbox' className='success' />
                      <span className='slider round' />
                    </label>
                  </li>
                </ul>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='card' style={{ margin: '50px 0' }}>
                <ul className='list-group list-group-flush'>
                  <li className='list-group-item'>
                    Releases
                    <label className='switch '>
                      <input type='checkbox' className='success' />
                      <span className='slider round' />
                    </label>
                  </li>
                  <li className='list-group-item'>
                    Deployments
                    <label className='switch '>
                      <input type='checkbox' className='success' />
                      <span className='slider round' />
                    </label>
                  </li>
                  <li className='list-group-item'>
                    Forks
                    <label className='switch '>
                      <input type='checkbox' className='success' />
                      <span className='slider round' />
                    </label>
                  </li>
                  <li className='list-group-item'>
                    Security Alerts
                    <label className='switch '>
                      <input type='checkbox' className='success' />
                      <span className='slider round' />
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Settings
