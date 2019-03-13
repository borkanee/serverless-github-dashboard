import React, { Component } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Organization from './Organization'
import OrganizationDetails from './OrganizationDetails'
import '../bootstrap-social.css'

const PAGE = {
    DASHBOARD: 0,
    DETAILS: 1
}


class Dashboard extends Component {
    state = {
        user: {},
        activePage: PAGE.DASHBOARD
    }

    componentDidMount() {
        this.doLogin()
    }

    componentWillUnmount() {
        this.state.socket.close()
    }

    setupSocket() {
        this.setState({
            socket: new WebSocket('wss://08l36ykm1d.execute-api.eu-north-1.amazonaws.com/dev?user=' + this.state.user.nick)
        })

        this.state.socket.addEventListener('open', function (event) {
            console.log('ÖPPEN SOCKET')
            console.log(event)
        })

        this.state.socket.addEventListener('message', function (event) {
            console.log('Message from server ', event.data)
        })
    }

    async setupWebhooks() {
        for (let i = 0; i < this.state.user.organizations.length; i++) {
            if (this.state.user.organizations[i].isAdmin && !this.state.user.organizations[i].hasHook) {
                try {
                    let hookResponse = await fetch('https://7vmkz7kzv2.execute-api.eu-north-1.amazonaws.com/dev/webhooks', {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            organization: this.state.user.organizations[i].name
                        })
                    })
                } catch (err) {
                    console.log(err)
                }
            }
        }
    }

    logout() {
        this.setState({
            user: {},
            activePage: PAGE.DASHBOARD,
            isAuthorized: false
        })
        window.sessionStorage.clear()
        this.state.socket.close()
    }

    displayDashboard(e) {
        this.setState({
            activePage: PAGE.DASHBOARD,
            chosenOrg: {}
        })

    }

    displayDetails(e) {
        const value = e.target.name
        this.setState({
            activePage: PAGE.DETAILS,
            chosenOrg: this.state.user.organizations.filter(org => org.name === value)[0]
        })
    }

    async doLogin(token) {
        this.setState({ isLoading: true })

        try {
            let user = await fetch('https://7vmkz7kzv2.execute-api.eu-north-1.amazonaws.com/dev/getUser', {
                credentials: 'include'
            })

            if (user.status === 401) {
                this.setState({ isLoading: false })
                return
            }

            if (user.status === 200) {
                // window.sessionStorage.setItem('token', token)
                user = await user.json()

                this.setState({
                    isLoading: false,
                    isAuthorized: true,
                    user: {
                        nick: user.nick,
                        avatarURL: user.avatarURL,
                        organizations: user.organizations
                    }
                })
                this.setupSocket()
                this.setupWebhooks()
            }
        } catch (err) {
            console.log(err)
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div className="text-center login-div">
                    <span>Loading...</span>
                </div>
            )
        }
        else if (this.state.isAuthorized) {
            let activePage
            if (this.state.activePage === PAGE.DASHBOARD) {
                activePage = <div className="card-deck">
                    {this.state.user.organizations.map(org => {
                        return (
                            <Organization key={org.name} {...org} displayDetails={this.displayDetails.bind(this)} />
                        )
                    })}
                </div>
            }

            if (this.state.activePage === PAGE.DETAILS) {
                activePage = <OrganizationDetails {...this.state.chosenOrg} user={this.state.user.nick} token={this.state.user.token} />
            }

            return (
                <React.Fragment>
                    <Navbar user={this.state.user.nick} logout={this.logout.bind(this)} />

                    <div className="container-fluid">
                        <div className="row">
                            <Sidebar
                                active={this.state.activePage}
                                displayDashboard={this.displayDashboard.bind(this)}
                            />
                            <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
                                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                                    <h1 className="h2">Dashboard</h1>
                                    <img src={this.state.user.avatarURL} className="user-avatar rounded-circle float-right" alt="user avatarxx" />
                                </div>

                                {activePage}
                            </main>
                        </div>
                    </div>
                </React.Fragment>
            )
        } else {
            return (
                <div className="text-center login-div">
                    <a href="https://7vmkz7kzv2.execute-api.eu-north-1.amazonaws.com/dev/auth" className="btn btn-github btn-lg active" role="button" aria-pressed="true">Login at Github</a>
                </div>
            )
        }
    }
}

export default Dashboard
