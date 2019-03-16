'use strict'

const AWS = require('aws-sdk')
const dynamoDB = new AWS.DynamoDB.DocumentClient()

async function main (event, context) {
  let user = event.pathParameters.user

  const params = {
    TableName: 'notifications',
    KeyConditionExpression: '#usr = :userVal',
    ExpressionAttributeNames: {
      '#usr': 'user'
    },
    ExpressionAttributeValues: {
      ':userVal': user
    }
  }

  try {
    let data = await dynamoDB.query(params).promise()
    if (data.Count > 0) {
      for (let item of data.Items) {
        let deleteParams = {
          TableName: 'notifications',
          Key: {
            user: item.user,
            notification: item.notification
          }
        }
        await dynamoDB.delete(deleteParams).promise()
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': 'https://910e6fe7.ngrok.io'
      }
    }
  } catch (err) {
    console.logg(err)
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': 'https://910e6fe7.ngrok.io'
      }
    }
  }
}

module.exports =
  {
    main
  }
