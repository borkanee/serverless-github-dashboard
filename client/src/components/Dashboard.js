import React, { Component } from 'react'

class Dashboard extends Component {
    state = {
        isLoggedIn: false
    }

    render() {
        if (this.state.isLoggedIn) {
            return (
                <div>LOGGED IN YAY</div>
            )
        } else {
            return (
                <div>
                    <a href="" className="btn btn-primary btn-lg active" role="button" aria-pressed="true">Login at Github</a>
                </div>
            )
        }
    }
}

export default Dashboard
