import React, { Component } from 'react'
import Navbar from './Navbar'
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
        this.setState({isLoading: true})

        try {
            let user = await fetch(`https://t3bi6cl38c.execute-api.eu-north-1.amazonaws.com/dev/getUser?access_token=${token}`)

            if (user.status === 200) {
                window.sessionStorage.setItem('token', token)
                user = await user.json()

                this.setState({
                    isLoading: false,
                    isAuthorized: true,
                    user: {
                        nick: user.login,
                        avatarURL: user.avatar_url
                    }
                })
            }
        } catch (err) {
            console.log(err)
        }
        
        this.getOrganizations()
    }

    async getOrganizations() {
        try {
            let orgs = await fetch(`https://api.github.com/user/orgs?access_token=${window.sessionStorage.getItem('token')}`)

            orgs = await orgs.json()
            orgs = orgs.map(org => {
                return {
                    name: org.login,
                    avatarURL: org.avatar_url,
                    description: org.description,
                    reposAPI: org.repos_url
                }
            })

            this.setState({ user: { ...this.state.user, organizations: orgs } });
            console.log(this.state.user)
        } catch (err) {
            console.log(err)
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <span>Loading...</span>
            )
        }
        else if (this.state.isAuthorized) {
            return (
                <Navbar user={this.state.user.nick} logout={this.logout.bind(this)}/>
            )
        } else {
            return (
                <div>
                    <a href="https://t3bi6cl38c.execute-api.eu-north-1.amazonaws.com/dev/auth" className="btn btn-github btn-lg active" role="button" aria-pressed="true">Login at Github</a>
                </div>
            )
        }
    }
}

export default Dashboard
