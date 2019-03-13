
'use strict'

const fetch = require('node-fetch')
const cookie = require('cookie')

async function configureHook (data, token) {
  const events = ['repository', 'commit_comment', 'issue_comment', 'project', 'release', 'deployment', 'fork', 'repository_vulnerability_alert']

  let fetchOptions = {
    'name': 'web',
    'events': events,
    'config': {
      'url': 'https://7vmkz7kzv2.execute-api.eu-north-1.amazonaws.com/dev/payload',
      'content_type': 'json'
    }
  }

  let url = `https://api.github.com/orgs/${data.organization}/hooks?access_token=${token}`

  let response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(fetchOptions),
    headers: { 'Content-Type': 'application/json' }
  })

  console.log(response)

  return {
    statusCode: response.status,
    headers: {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': 'https://910e6fe7.ngrok.io'
    }
  }
}

module.exports.main = async (event, context) => {
  if (!event.headers.Cookie) {
    return {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': 'https://910e6fe7.ngrok.io'
      },
      body: JSON.stringify({ 'message': 'Unauthorized' })
    }
  }

  const data = JSON.parse(event.body)

  try {
    let token = cookie.parse(event.headers.Cookie).token || ''

    return configureHook(data, token)
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': 'https://910e6fe7.ngrok.io'
      }
    }
  }
}
