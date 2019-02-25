'use strict'

async function main(event, context) {
  console.log(event)
  if (event.requestContext.routeKey === '$connect') {
    console.log('NEW CONNECTION INCOMMING')
  }

  console.log('Connection ok')
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}

module.exports =
  {
    main
  }
