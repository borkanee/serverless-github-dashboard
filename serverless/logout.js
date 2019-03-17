'use strict'

async function main (event, context) {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Credential': true,
      'Access-Control-Allow-Origin': 'https://dhif4tawafcug.cloudfront.net',
      'Set-Cookie': 'token=; Max-Age=-3600; HttpOnly; Secure;'
    }
  }
}

module.exports =
  {
    main
  }
