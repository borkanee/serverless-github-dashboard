import React, { Component } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Organization from './Organization'
import '../bootstrap-social.css'
import qs from 'qs'



class Dashboard extends Component {
    state = {
        user: {}
    }

    componentDidMount() {
        let sessionToken = window.sessionStorage.getItem('token')
        let queryToken = qs.parse(window.location.search, { ignoreQueryPrefix: true }).access_token

        if (sessionToken) {
            this.doLogin(sessionToken)
        }
        if (queryToken) {
            this.doLogin(queryToken)
        }
    }

    logout() {
        window.sessionStorage.removeItem('token')
        this.setState({ user: {} })
        window.location.href = '/'
    }

    async doLogin(token) {
        this.setState({ isLoading: true })

        try {
            let user = await fetch(`https://t3bi6cl38c.execute-api.eu-north-1.amazonaws.com/dev/getUser?access_token=${token}`)

            if (user.status === 200) {
                window.sessionStorage.setItem('token', token)
                user = await user.json()

                let orgs = await this.getOrganizations()

                this.setState({
                    isLoading: false,
                    isAuthorized: true,
                    user: {
                        nick: user.login,
                        avatarURL: user.avatar_url,
                        organizations: orgs
                    }
                })

            }
        } catch (err) {
            console.log(err)
        }


    }

    async getOrganizations() {
        try {
            let orgs = await fetch(`https://api.github.com/user/orgs?access_token=${window.sessionStorage.getItem('token')}`)

            orgs = await orgs.json()
            return orgs.map(org => {
                return {
                    name: org.login,
                    avatarURL: org.avatar_url,
                    description: org.description,
                    reposAPI: org.repos_url
                }
            })

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
            return (
                <React.Fragment>
                    <Navbar user={this.state.user.nick} logout={this.logout.bind(this)} />

                    <div className="container-fluid">
                        <div className="row">
                            <Sidebar />
                            <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
                                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                                    <h1 className="h2">Dashboard</h1>
                                    <img src={this.state.user.avatarURL} className="user-avatar rounded float-right" alt="user image" />
                                </div>
                                <div className="card-deck">
                                    {this.state.user.organizations.map(org => {
                                        return (
                                            <Organization key={org.name} {...org} />
                                        )
                                    })}
                                </div>
                            </main>
                        </div>
                    </div>
                </React.Fragment>
            )
        } else {
            return (
                <div className="text-center login-div">
                    <a href="https://t3bi6cl38c.execute-api.eu-north-1.amazonaws.com/dev/auth" className="btn btn-github btn-lg active" role="button" aria-pressed="true">Login at Github</a>
                </div>
            )
        }
    }
}

export default Dashboard
