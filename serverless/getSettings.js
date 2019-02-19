'use strict'

const AWS = require('aws-sdk')
const dynamoDB = new AWS.DynamoDB.DocumentClient()

async function main (event, context) {

  const params = {
    TableName: 'settings',
    Key: {
      user: event.pathParameters.user,
      organization: event.pathParameters.organization
    }
  }

  try {
    const data = await dynamoDB.get(params).promise()

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: data.Item.settings
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  }
}

module.exports =
  {
    main
  }
