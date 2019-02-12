'use strict'

const fetch = require('node-fetch')

async function main (event, context) {
  let user = await fetch(`https://api.github.com/user?access_token=${event.queryStringParameters.access_token}`)

  if (user.status === 401) {
    return {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ 'message': 'Unauthorized' })
    }
  }

  if (user.status === 200) {
    user = await user.json()
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
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
