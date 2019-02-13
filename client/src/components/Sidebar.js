
import React, { Component } from 'react'

class Sidebar extends Component {
  render () {
    return (
      <nav className='col-md-2 d-none d-md-block bg-light sidebar'>
        <div className='sidebar-sticky'>
          <ul className='nav flex-column'>
            <li className='nav-item'>
              <a className='nav-link active' href='#'>
                <span data-feather='home' />
                Dashboard <span className='sr-only'>(current)</span>
              </a>
            </li>
            <li className='nav-item'>
              <a className='nav-link' href='#'>
                <span data-feather='shopping-cart' />
                Settings
              </a>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}

export default Sidebar
