
'use strict'

const fetch = require('node-fetch')

async function main (event, context) {
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
      'url': 'https://t3bi6cl38c.execute-api.eu-north-1.amazonaws.com/dev/payload',
      'content_type': 'json'

    }
  }

  try {
    let response = await fetch(`https://api.github.com/orgs/${data.organization}/hooks?access_token=${data.token}`, {
      method: 'POST',
      body: JSON.stringify(options),
      headers: { 'Content-Type': 'application/json' }
    })

    response = await response.json()

    console.log(response)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  }
}

module.exports =
  {
    main
  }
