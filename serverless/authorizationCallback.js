'use strict'

const fetch = require('node-fetch')

module.exports.main = async (event, context) => {
  const tokenURL =
    `https://github.com/login/oauth/access_token?code=${event.queryStringParameters.code}&state=${process.env.GITHUB_API_STATE}&client_id=${process.env.GITHUB_CLIENT}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`

  try {
    let res = await fetch(tokenURL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!res.ok) {
      return {
        statusCode: res.status,
        body: res.statusText
      }
    }

    res = await res.json()

    return {
      statusCode: 301,
      headers: {
        'Access-Control-Allow-Origin': process.env.CLIENT_BASE_URL,
        'Access-Control-Allow-Credential': true,
        'Set-Cookie': `token=${res.access_token}; Max-Age=3600; HttpOnly; Secure;`,
        'Location': process.env.CLIENT_BASE_URL

      }
    }
  } catch (err) {
    console.log(err) // output to AWS Log
    return {
      statusCode: 500,
      body: err.message
    }
  }
}
