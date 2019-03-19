'use strict'

const AWS = require('aws-sdk')
const dynamoDB = new AWS.DynamoDB.DocumentClient()

async function main (event, context) {
  const data = JSON.parse(event.body)

  const params = {
    TableName: 'userSettings',
    Item: {
      user: data.user,
      organization: data.org,
      settings: JSON.stringify(data.settings)
    }
  }

  try {
    await dynamoDB.put(params).promise()
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
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

module.exports =
  {
    main
  }
