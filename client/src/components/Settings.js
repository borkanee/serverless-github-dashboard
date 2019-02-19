import React, { Component } from 'react'

class Settings extends Component {
  state = {
    settings: {
      repos: false,
      commits: false,
      issueComments: false,
      projects: false,
      releases: false,
      deployments: false,
      forks: false,
      securityAlerts: false
    }
  }

  componentDidMount() {
    // TODO: Fetch settings from API for current user and organization and change state. 

  }

  saveSettings = async (e) => {
    if (e.target.type === 'checkbox') {

      try {

        await this.setState({
          settings: { ...this.state.settings, [e.target.name]: !this.state.settings[e.target.name] }
        })

        const jsonBody = JSON.stringify({
          user: this.props.user,
          org: this.props.org,
          settings: this.state.settings
        })


        let res = await fetch(`https://t3bi6cl38c.execute-api.eu-north-1.amazonaws.com/dev/settings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: jsonBody
        })

      } catch (err) {
        console.log(err)
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className='row justify-content-center'>
          <h3>Notification settings</h3>
        </div>
        <div className='container'>
          <div className='row' onChange={this.saveSettings}>
            <div className='col-md-6'>
              <div className='card' style={{ margin: '50px 0' }}>
                <ul className='list-group list-group-flush'>
                  <li className='list-group-item'>
                    Repositories
                    <label className='switch '>
                      <input type='checkbox' checked={this.state.settings.repos} name='repos' className='success' />
                      <span className='slider round' />
                    </label>
                  </li>
                  <li className='list-group-item'>
                    Commits
                    <label className='switch '>
                      <input type='checkbox' checked={this.state.settings.commits} name='commits' className='success' />
                      <span className='slider round' />
                    </label>
                  </li>
                  <li className='list-group-item'>
                    Issue comments
                    <label className='switch '>
                      <input type='checkbox' checked={this.state.settings.issueComments} name='issueComments' className='success' />
                      <span className='slider round' />
                    </label>
                  </li>
                  <li className='list-group-item'>
                    Projects
                    <label className='switch '>
                      <input type='checkbox' checked={this.state.settings.projects} name='projects' className='success' />
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
                      <input type='checkbox' checked={this.state.settings.releases} name='releases' className='success' />
                      <span className='slider round' />
                    </label>
                  </li>
                  <li className='list-group-item'>
                    Deployments
                    <label className='switch '>
                      <input type='checkbox' checked={this.state.settings.deployments} name='deployments' className='success' />
                      <span className='slider round' />
                    </label>
                  </li>
                  <li className='list-group-item'>
                    Forks
                    <label className='switch '>
                      <input type='checkbox' checked={this.state.settings.forks} name='forks' className='success' />
                      <span className='slider round' />
                    </label>
                  </li>
                  <li className='list-group-item'>
                    Security Alerts
                    <label className='switch '>
                      <input type='checkbox' checked={this.state.settings.securityAlerts} name='securityAlerts' className='success' />
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
