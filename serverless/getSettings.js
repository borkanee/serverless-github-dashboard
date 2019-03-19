'use strict'

const AWS = require('aws-sdk')
const dynamoDB = new AWS.DynamoDB.DocumentClient()
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credential': true
}

async function main (event, context) {
  const params = {
    TableName: 'userSettings',
    Key: {
      user: event.pathParameters.user,
      organization: event.pathParameters.organization
    }
  }

  try {
    const data = await dynamoDB.get(params).promise()

    if (data.Item) {
      return {
        statusCode: 200,
        headers,
        body: data.Item.settings
      }
    } else {
      return {
        statusCode: 204,
        headers
      }
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers
    }
  }
}

module.exports =
  {
    main
  }
