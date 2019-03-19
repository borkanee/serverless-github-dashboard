'use strict'

const AWS = require('aws-sdk')
const dynamoDB = new AWS.DynamoDB.DocumentClient()

async function main (event, context) {
  if (event.headers.Origin !== process.env.CLIENT_BASE_URL) {
    return {
      statusCode: 404
    }
  }

  if (event.requestContext.routeKey === '$connect') {
    let user = event.queryStringParameters.user
    let connectionID = event.requestContext.connectionId

    const params = {
      TableName: 'socketConnections',
      Item: {
        user,
        connectionID
      }
    }

    try {
      await dynamoDB.put(params).promise()
      return {
        statusCode: 200
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
}

module.exports =
  {
    main
  }
