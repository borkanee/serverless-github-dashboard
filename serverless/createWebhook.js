
'use strict'

async function main (event, context) {
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
      'url': 'http://localhost:3000/payload',
      'content_type': 'json'

    }
  }

  try {
    await fetch(`https://api.github.com/orgs/${event.body.organization}/hooks?access_token=${event.body.token}`, {
      method: 'POST',
      body: JSON.stringify(options),
      headers: { 'Content-Type': 'application/json' }
    })

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  } catch (err) {
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
