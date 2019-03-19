import React, { Component } from 'react'

class Notification extends Component {
  renderObj () {
    return Object.keys(this.props.notification).map(key => {
      if (key === 'link') {
        return (
          <a href={this.props.notification.link} rel='noopener noreferrer' target='_blank' className='btn btn-primary'>GitHub</a>
        )
      } else if (key === 'unseen') {
        return false
      } else {
        return (
          <p className='card-text'>{key}: {this.props.notification[key]}</p>
        )
      }
    })
  }

  render () {
    return (
      <React.Fragment>
        <div className='card mx-auto my-2 text-center' style={{ width: '25rem' }}>
          <div className={`card-header ${this.props.notification.unseen ? 'unseen' : ''}`} />
          <div className='card-body'>
            <h5 className='card-title'>Notification</h5>
            {this.renderObj()}
          </div>
        </div>
      </React.Fragment >
    )
  }
}

export default Notification
