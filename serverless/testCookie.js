'use strict'

const cookie = require('cookie');

async function main (event, context) {
  let cookies = cookie.parse(event.headers.Cookie || '')

  console.log(cookies)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': 'http://1bf558e3.ngrok.io'
    },
    body: JSON.stringify({ msg: 'test' })
  }
}

module.exports =
  {
    main
  }
