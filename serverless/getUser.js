'use strict'

const fetch = require('node-fetch')
const cookie = require('cookie')
const AWS = require('aws-sdk')
const dynamoDB = new AWS.DynamoDB.DocumentClient()

async function main (event, context) {
  let token = cookie.parse(event.headers.Cookie || '').token || ''

  try {
    let user = await fetch(`https://api.github.com/user?access_token=${token}`)

    if (user.status === 401) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': 'https://910e6fe7.ngrok.io',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({ 'message': 'Unauthorized' })
      }
    }

    if (user.status === 200) {
      user = await user.json()

      let orgs = await fetch(`https://api.github.com/user/orgs?access_token=${token}`)
      orgs = await orgs.json()

      let notificationsParams = {
        TableName: 'notifications',
        KeyConditionExpression: '#usr = :userVal',
        ProjectionExpression: 'notification',
        ExpressionAttributeNames: {
          '#usr': 'user'
        },
        ExpressionAttributeValues: {
          ':userVal': user.login
        }
      }

      let notifications = await dynamoDB.query(notificationsParams).promise()
      if (notifications.Count > 0) {
        notifications = notifications.Items.map(i => JSON.parse(i.notification))
      } else {
        notifications = []
      }

      let promises = orgs.map(async org => {
        let repos = await fetch(`${org.repos_url}?access_token=${token}`)
        repos = await repos.json()

        let organizationAdmins = await fetch(`https://api.github.com/orgs/${org.login}/members?role=admin&access_token=${token}`)
        organizationAdmins = await organizationAdmins.json()

        let isAdmin = organizationAdmins.some(admin => admin.login === user.login)
        let hasHook = false

        if (isAdmin) {
          let hook = await fetch(`${org.hooks_url}?access_token=${token}`)
          hook = await hook.json()
          if (hook.length > 0) {
            hasHook = true
          }
        }

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
          isAdmin,
          hasHook,
          avatarURL: org.avatar_url,
          description: org.description,
          repos
        }
      })

      let organizations = await Promise.all(promises)

      user = {
        nick: user.login,
        avatarURL: user.avatar_url,
        organizations,
        notifications
      }

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': 'https://910e6fe7.ngrok.io',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify(user)
      }
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': 'https://910e6fe7.ngrok.io',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ message: 'Something went wrong...' })
    }
  }
}

module.exports =
  {
    main
  }
