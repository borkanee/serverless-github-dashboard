import React, { Component } from 'react'

class Settings extends Component {
  state = {
    settings: {
      repository: false,
      push: false,
      issues: false,
      project: false,
      release: false,
      deployment: false,
      fork: false,
      repository_vulnerability_alert: false
    }
  }

  async componentDidMount() {

    if (window.sessionStorage.getItem(this.props.org)) {
      return this.setState({ settings: JSON.parse(window.sessionStorage.getItem(this.props.org)) })
    }

    try {
      let res = await fetch(`https://8i58zxdosl.execute-api.eu-north-1.amazonaws.com/prod/settings/${this.props.user}/${this.props.org}`)
      if (res.status === 204) {
        return
      }

      res = await res.json()

      this.setState({ settings: res })
      window.sessionStorage.setItem(this.props.org, JSON.stringify(res))
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

        let res = await fetch(`https://8i58zxdosl.execute-api.eu-north-1.amazonaws.com/prod/settings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: jsonBody
        })

        console.log(res)

        window.sessionStorage.setItem(this.props.org, JSON.stringify(this.state.settings))

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
                      <input type='checkbox' checked={this.state.settings.repository} onChange={this.handleCheckboxChange} name='repository' className='success' />
                      <span className='slider round' />
                    </label>
                  </li>
                  <li className='list-group-item'>
                    Push
                    <label className='switch '>
                      <input type='checkbox' checked={this.state.settings.push} onChange={this.handleCheckboxChange} name='push' className='success' />
                      <span className='slider round' />
                    </label>
                  </li>
                  <li className='list-group-item'>
                    Issues
                    <label className='switch '>
                      <input type='checkbox' checked={this.state.settings.issues} onChange={this.handleCheckboxChange} name='issues' className='success' />
                      <span className='slider round' />
                    </label>
                  </li>
                  <li className='list-group-item'>
                    Projects
                    <label className='switch '>
                      <input type='checkbox' checked={this.state.settings.project} onChange={this.handleCheckboxChange} name='project' className='success' />
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
                      <input type='checkbox' checked={this.state.settings.release} onChange={this.handleCheckboxChange} name='release' className='success' />
                      <span className='slider round' />
                    </label>
                  </li>
                  <li className='list-group-item'>
                    Deployments
                    <label className='switch '>
                      <input type='checkbox' checked={this.state.settings.deployment} onChange={this.handleCheckboxChange} name='deployment' className='success' />
                      <span className='slider round' />
                    </label>
                  </li>
                  <li className='list-group-item'>
                    Forks
                    <label className='switch '>
                      <input type='checkbox' checked={this.state.settings.fork} onChange={this.handleCheckboxChange} name='fork' className='success' />
                      <span className='slider round' />
                    </label>
                  </li>
                  <li className='list-group-item'>
                    Security Alerts
                    <label className='switch '>
                      <input type='checkbox' checked={this.state.settings.repository_vulnerability_alert} onChange={this.handleCheckboxChange} name='repository_vulnerability_alert' className='success' />
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
