
'use strict'

async function main (event, context) {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': process.env.CLIENT_BASE_URL,
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, DELETE'
    }
  }
}

module.exports =
  {
    main
  }
