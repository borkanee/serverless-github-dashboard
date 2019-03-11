'use strict'

const fetch = require('node-fetch')
const cookie = require('cookie')

async function main (event, context) {
  if (!event.headers.Cookie) {
    return {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': 'http://910e6fe7.ngrok.io',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ 'message': 'Unauthorized' })
    }
  }

  let token = cookie.parse(event.headers.Cookie).token || ''

  let user = await fetch(`https://api.github.com/user?access_token=${token}`)

  if (user.status === 401) {
    return {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': 'http://910e6fe7.ngrok.io',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ 'message': 'Unauthorized' })
    }
  }

  if (user.status === 200) {
    user = await user.json()

    let orgs = await fetch(`https://api.github.com/user/orgs?access_token=${token}`)
    orgs = await orgs.json()

    let promises = orgs.map(async org => {
      let repos = await fetch(org.repos_url)
      repos = await repos.json()

      repos = repos.map(repo => {
        return {
          name: repo.name,
          id: repo.id,
          private: repo.private,
          URL: repo.html_url,
          description: repo.description
        }
      })

      return {
        name: org.login,
        avatarURL: org.avatar_url,
        description: org.description,
        repos
      }
    })

    let organizations = await Promise.all(promises)

    user = {
      nick: user.login,
      avatarURL: user.avatar_url,
      organizations
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'http://910e6fe7.ngrok.io',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(user)
    }
  }
}

module.exports =
  {
    main
  }
