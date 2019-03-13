'use strict'

const AWS = require('aws-sdk')
const dynamoDB = new AWS.DynamoDB.DocumentClient()

async function main (event, context) {
  console.log('disconnectar')

  let connectionID = event.requestContext.connectionId

  let params = {
    TableName: 'connections',
    Key: {
      connectionID
    }
  }

  try {
    await dynamoDB.delete(params).promise()
  } catch (err) {
    console.log(err)
  }
}

module.exports =
  {
    main
  }
