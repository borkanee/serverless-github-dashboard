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

  async componentDidMount() {
    // TODO: Fetch settings from API for current user and organization and change state. 
    try {
      let res = await fetch(`https://t3bi6cl38c.execute-api.eu-north-1.amazonaws.com/dev/settings/${this.props.org}/${this.props.user}`)
      res = await res.json()

      this.setState({ settings: res })
    } catch (err) {
      console.log(err)
    }
  }

  handleCheckboxChange = async (e) => {
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


        let hookResponse = await fetch(`https://t3bi6cl38c.execute-api.eu-north-1.amazonaws.com/dev/webhooks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            token: this.props.token,
            organization: this.props.org
           })
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
          <div className='row'>
            <div className='col-md-6'>
              <div className='card' style={{ margin: '50px 0' }}>
                <ul className='list-group list-group-flush'>
                  <li className='list-group-item'>
                    Repositories
                    <label className='switch '>
                      <input type='checkbox' checked={this.state.settings.repos} onChange={this.handleCheckboxChange} name='repos' className='success' />
                      <span className='slider round' />
                    </label>
                  </li>
                  <li className='list-group-item'>
                    Commits
                    <label className='switch '>
                      <input type='checkbox' checked={this.state.settings.commits} onChange={this.handleCheckboxChange} name='commits' className='success' />
                      <span className='slider round' />
                    </label>
                  </li>
                  <li className='list-group-item'>
                    Issue comments
                    <label className='switch '>
                      <input type='checkbox' checked={this.state.settings.issueComments} onChange={this.handleCheckboxChange} name='issueComments' className='success' />
                      <span className='slider round' />
                    </label>
                  </li>
                  <li className='list-group-item'>
                    Projects
                    <label className='switch '>
                      <input type='checkbox' checked={this.state.settings.projects} onChange={this.handleCheckboxChange} name='projects' className='success' />
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
                      <input type='checkbox' checked={this.state.settings.releases} onChange={this.handleCheckboxChange} name='releases' className='success' />
                      <span className='slider round' />
                    </label>
                  </li>
                  <li className='list-group-item'>
                    Deployments
                    <label className='switch '>
                      <input type='checkbox' checked={this.state.settings.deployments} onChange={this.handleCheckboxChange} name='deployments' className='success' />
                      <span className='slider round' />
                    </label>
                  </li>
                  <li className='list-group-item'>
                    Forks
                    <label className='switch '>
                      <input type='checkbox' checked={this.state.settings.forks} onChange={this.handleCheckboxChange} name='forks' className='success' />
                      <span className='slider round' />
                    </label>
                  </li>
                  <li className='list-group-item'>
                    Security Alerts
                    <label className='switch '>
                      <input type='checkbox' checked={this.state.settings.securityAlerts} onChange={this.handleCheckboxChange} name='securityAlerts' className='success' />
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
