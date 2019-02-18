
import React, { Component } from 'react'

class Sidebar extends Component {
  render () {
    return (
      <nav className='col-md-2 d-none d-md-block bg-light sidebar'>
        <div className='sidebar-sticky'>
          <ul className='nav flex-column'>
            <li className='nav-item'>
              <a className={(this.props.active === 0) ? 'nav-link active' : 'nav-link'} onClick={this.props.displayDashboard} href='#'>
                <span data-feather='home' />
                Dashboard <span className='sr-only'>(current)</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}

export default Sidebar
