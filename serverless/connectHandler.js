'use strict'

const AWS = require('aws-sdk')
const dynamoDB = new AWS.DynamoDB.DocumentClient()

async function main (event, context) {
  if (event.headers.Origin !== 'https://910e6fe7.ngrok.io') {
    return {
      statusCode: 404
    }
  }

  if (event.requestContext.routeKey === '$connect') {
    let user = event.queryStringParameters.user
    let connectionID = event.requestContext.connectionId

    const params = {
      TableName: 'connections',
      Item: {
        connectionID,
        user
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