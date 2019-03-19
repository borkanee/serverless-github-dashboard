'use strict'

const AWS = require('aws-sdk')
const dynamoDB = new AWS.DynamoDB.DocumentClient()
const headers = {
  'Access-Control-Allow-Origin': '*'
}

async function main (event, context) {
  let data = JSON.parse(event.body)

  const params = {
    TableName: 'serviceWorkers',
    Item: {
      user: data.user,
      worker: JSON.stringify(data.subscription)
    }
  }

  try {
    await dynamoDB.put(params).promise()
    return {
      statusCode: 201,
      headers
    }
  } catch (err) {
    console.log(err)
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
