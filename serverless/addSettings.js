'use strict'

const AWS = require('aws-sdk')
const dynamoDB = new AWS.DynamoDB.DocumentClient()

async function main (event, context) {
  const data = JSON.parse(event.body)

  const params = {
    TableName: 'settings',
    Item: {
      user: data.user,
      settings: JSON.stringify(data.settings)
    }
  }

  try {
    await dynamoDB.put(params).promise()
    return {
      statusCode: 201
    }
  } catch (err) {
    return {
      statusCode: 500
    }
  }
}

module.exports =
  {
    main
  }
