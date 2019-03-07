
'use strict'

const fetch = require('node-fetch')
const cookie = require('cookie')

async function main (event, context) {
  if (!event.headers.Cookie) {
    return {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': 'http://910e6fe7.ngrok.io'
      },
      body: JSON.stringify({ 'message': 'Unauthorized' })
    }
  }

  let token = cookie.parse(event.headers.Cookie).token || ''
  const data = JSON.parse(event.body)

  // Sets up config for WebHook
  const options = {
    'name': 'web',
    'active': true,
    'events': [
      'repository',
      'commit_comment',
      'issue_comment',
      'project',
      'release',
      'deployment',
      'fork',
      'repository_vulnerability_alert'
    ],
    'config': {
      'url': 'https://3vum3l32ja.execute-api.eu-north-1.amazonaws.com/dev/payload',
      'content_type': 'json'

    }
  }

  try {
    let response = await fetch(`https://api.github.com/orgs/${data.organization}/hooks?access_token=${token}`, {
      method: 'POST',
      body: JSON.stringify(options),
      headers: { 'Content-Type': 'application/json' }
    })

    response = await response.json()

    console.log(response)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': 'http://910e6fe7.ngrok.io'
      }
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': 'http://910e6fe7.ngrok.io'
      }
    }
  }
}

module.exports =
  {
    main
  }
