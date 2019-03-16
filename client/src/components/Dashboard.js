import React, { Component } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Organization from './Organization'
import Notifications from './Notifications'
import OrganizationDetails from './OrganizationDetails'
import '../bootstrap-social.css'

const publicVapidKey = 'BGqqZm74jsX141bCEXum-EePHgPFtTCPdeptiUR7KLQDKr_VfGc6fAu9wTZ9lvD8PyMcsaMqdEFiNvftmbmtZ7o'

const PAGE = {
    DASHBOARD: 0,
    DETAILS: 1,
    NOTIFICATIONS: 2
}


class Dashboard extends Component {
    state = {
        user: {},
        activePage: PAGE.DASHBOARD,
        notifications: [],
        notificationCounter: 0
    }

    async componentDidMount() {
        await this.doLogin()
    }

    async componentWillUnmount() {
        this.state.socket.close()
    }

    async removeNotifications() {
        try {
            await fetch('https://v8ah3e45f1.execute-api.eu-north-1.amazonaws.com/dev/notifications/' + this.state.user.nick, {
                method: 'DELETE',
                credentials: 'include'
            })
        } catch (err) {
            console.log(err)
        }
    }

    setupSocket() {
        this.setState({
            socket: new WebSocket('wss://7v320l37ab.execute-api.eu-north-1.amazonaws.com/dev?user=' + this.state.user.nick)
        })

        this.state.socket.addEventListener('open', event => {
            console.log('ÖPPEN SOCKET')
        })

        this.state.socket.addEventListener('message', event => {
            console.log('Message from server ', event.data)
            let data = JSON.parse(event.data)
            this.setState({
                notificationCounter: this.state.notificationCounter + 1,
                notifications: [...this.state.notifications, data].reverse()
            })
        })
    }

    async setupWebhooks() {
        for (let i = 0; i < this.state.user.organizations.length; i++) {
            if (this.state.user.organizations[i].isAdmin && !this.state.user.organizations[i].hasHook) {
                try {
                    let hookResponse = await fetch('https://v8ah3e45f1.execute-api.eu-north-1.amazonaws.com/dev/webhooks', {
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

    resetCounter() {
        let notifications = [...this.state.notifications]
        for (let i = 0; i < notifications.length; i++) {
            notifications[i].unseen = false
        }
        this.setState({
            notifications,
            notificationCounter: 0
        })
        this.removeNotifications()
    }

    displayDashboard(e) {
        this.setState({
            activePage: PAGE.DASHBOARD,
            chosenOrg: {}
        })
    }

    displayNotifications() {
        this.setState({
            activePage: PAGE.NOTIFICATIONS
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
            let user = await fetch('https://v8ah3e45f1.execute-api.eu-north-1.amazonaws.com/dev/getUser', {
                credentials: 'include'
            })

            if (user.status === 401) {
                this.setState({ isLoading: false })
                return
            }

            if (user.status === 200) {
                // window.sessionStorage.setItem('token', token)
                user = await user.json()
                console.log(user)

                this.setState({
                    isLoading: false,
                    isAuthorized: true,
                    user: {
                        nick: user.nick,
                        avatarURL: user.avatarURL,
                        organizations: user.organizations
                    },
                    notificationCounter: user.notifications.length,
                    notifications: user.notifications
                })
                await this.setupSocket()
                await this.setupWebhooks()

                if ('serviceWorker' in navigator) {
                    send(user.nick)
                }
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
                activePage = <div className="card-columns">
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

            if (this.state.activePage === PAGE.NOTIFICATIONS) {
                activePage = <Notifications notifications={this.state.notifications} resetCounter={this.resetCounter.bind(this)} />
            }

            return (
                <React.Fragment>
                    <Navbar user={this.state.user.nick} logout={this.logout.bind(this)} />

                    <div className="container-fluid">
                        <div className="row">
                            <Sidebar
                                active={this.state.activePage}
                                displayDashboard={this.displayDashboard.bind(this)}
                                displayNotifications={this.displayNotifications.bind(this)}
                                notificationCounter={this.state.notificationCounter}
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
                    <a href='https://v8ah3e45f1.execute-api.eu-north-1.amazonaws.com/dev/auth' className="btn btn-github btn-lg active" role="button" aria-pressed="true">Login at Github</a>
                </div>
            )
        }
    }
}

export default Dashboard

async function send(user) {
    const register = await navigator.serviceWorker.register('serviceWorker.js', {
        scope: '/'
    })

    await navigator.serviceWorker.ready

    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    })

    await fetch('https://v8ah3e45f1.execute-api.eu-north-1.amazonaws.com/dev/register', {
        method: 'POST',
        body: JSON.stringify({
            subscription,
            user
        }),
        headers: {
            'content-type': 'application/json'
        }
    })
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}