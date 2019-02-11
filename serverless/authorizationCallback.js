'use strict'

const fetch = require('node-fetch')

module.exports.main = async (event, context) => {
  const tokenURL = `https://github.com/login/oauth/access_token?code=${event.queryStringParameters.code}&client_id=${process.env.GITHUB_CLIENT}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`

  let res = await fetch(tokenURL)

  if (!res.ok) {
    return {
      statusCode: res.status,
      body: res.statusText
    }
  }

  let token = await res.text()

  return {
    statusCode: 301,
    headers: {
      Location: `https://localhost:3000/?${token}`
    }
  }
}
