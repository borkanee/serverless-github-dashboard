
'use strict'

async function main (event, context) {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': 'http://910e6fe7.ngrok.io',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  }
}

module.exports =
  {
    main
  }
