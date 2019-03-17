
import React, { Component } from 'react'

const PAGE = {
  DASHBOARD: 0,
  DETAILS: 1,
  NOTIFICATIONS: 2
}

class Sidebar extends Component {
  render () {
    return (
      <nav className='col-md-2 d-none d-md-block bg-light sidebar'>
        <div className='sidebar-sticky'>
          <ul className='nav flex-column'>
            <li className='nav-item'>
              <a href='#' className={(this.props.active === PAGE.DASHBOARD) ? 'nav-link active' : 'nav-link'} onClick={this.props.displayDashboard} >
                <span data-feather='home' />
                Dashboard
              </a>
            </li>
            <li className='nav-item'>
              <a href='#' className={(this.props.active === PAGE.NOTIFICATIONS) ? 'nav-link active' : 'nav-link'} onClick={this.props.displayNotifications} >
                <span data-feather='home' />
                Notifications <span className='badge badge-light'>{this.props.notificationCounter}</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}

export default Sidebar
