
'use strict'

const fetch = require('node-fetch')
const cookie = require('cookie')

async function getExistingHook (org, token) {
  let hook = await fetch(`https://api.github.com/orgs/${org}/hooks?access_token=${token}`)
  return hook
}

function createEventsOptions (settings) {
  let eventsArray = []
  for (let event in settings) {
    if (settings[event]) {
      eventsArray.push(event)
    }
  }
  return eventsArray
}

async function deleteHook (org, id, token) {
  let response = await fetch(`https://api.github.com/orgs/${org}/hooks/${id}?access_token=${token}`, {
    method: 'DELETE'
  })
  return {
    statusCode: response.status,
    headers: {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': 'https://910e6fe7.ngrok.io'
    }
  }
}

async function configureHook (data, token, existingHook) {
  const events = ['repository', 'commit_comment', 'issue_comment', 'project', 'release', 'deployment', 'fork', 'repository_vulnerability_alert']
  // const events = createEventsOptions(data.settings)

  let url, requestMethod
  let fetchOptions = {
    'events': events,
    'config': {
      'url': 'https://7vmkz7kzv2.execute-api.eu-north-1.amazonaws.com/dev/payload',
      'content_type': 'json'
    }
  }

  if (existingHook) {
    if (events.length === 0) {
      return deleteHook(data.organization, existingHook[0].id, token)
    }
    url = `https://api.github.com/orgs/${data.organization}/hooks/${existingHook[0].id}?access_token=${token}`
    requestMethod = 'PATCH'
  } else {
    url = `https://api.github.com/orgs/${data.organization}/hooks?access_token=${token}`
    requestMethod = 'POST'
    fetchOptions.name = 'web'
  }

  let response = await fetch(url, {
    method: requestMethod,
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
    /* let existingHook = await getExistingHook(data.organization, token)

    if (existingHook.status !== 200) {
      return {
        statusCode: existingHook.status,
        headers: {
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Origin': 'https://910e6fe7.ngrok.io'
        },
        body: JSON.stringify({ message: 'Could not add Webhook' })
      }
    }

    existingHook = await existingHook.json()
    console.log(existingHook, 'hej')

    if (existingHook.length !== 0) {
      return configureHook(data, token, existingHook)
    } */
    // Sets up config for WebHook IF NOT existing...
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
