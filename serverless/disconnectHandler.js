'use strict'

const AWS = require('aws-sdk')
const dynamoDB = new AWS.DynamoDB.DocumentClient()

async function main (event, context) {
  let connectionID = event.requestContext.connectionId

  let params = {
    TableName: 'socketConnections',
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
