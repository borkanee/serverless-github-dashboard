import React, { Component } from 'react'
import Notification from './Notification'

class Notifications extends Component {
  componentWillUnmount () {
    this.props.resetCounter()
  }

  render () {
    return (
      <React.Fragment>
        {this.props.notifications.map(obj => {
          return (
            <Notification notification={obj} />
          )
        })}
      </React.Fragment >
    )
  }
}

export default Notifications
