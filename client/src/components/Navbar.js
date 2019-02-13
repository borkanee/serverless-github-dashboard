import React, { Component } from 'react'

class Navbar extends Component {
  render () {
    return (
      <React.Fragment>
        <nav className='navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow'>
          <a className='navbar-brand col-sm-3 col-md-2 mr-0' href='#'>{this.props.user}</a>
          <ul className='navbar-nav px-3'>
            <li className='nav-item text-nowrap'>
              <a className='nav-link' href='#' onClick={this.props.logout}>Sign out</a>
            </li>
          </ul>
        </nav>
      </React.Fragment>
    )
  }
}

export default Navbar
