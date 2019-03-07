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

    if (data.Item) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credential': true
        },
        body: data.Item.settings
      }
    } else {
      return {
        statusCode: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credential': true
        }
      }
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credential': true
      }
    }
  }
}

module.exports =
  {
    main
  }
