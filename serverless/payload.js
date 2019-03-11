'use strict'

const AWS = require('aws-sdk')
// const dynamoDB = new AWS.DynamoDB.DocumentClient()

const sendMessageToClient = (payload) => new Promise((resolve, reject) => {
  const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({ apiVersion: '2029', endpoint: 'https://hkv46okwog.execute-api.eu-north-1.amazonaws.com/dev' })
  apigatewaymanagementapi.postToConnection({
    ConnectionId: 'WYAXZfJcgi0CJMg=',
    Data: JSON.stringify(payload)
  }, (err, data) => {
    if (err) {
      console.log('err is', err)
      reject(err)
    }
    resolve(data)
  })
})

async function main (event, context) {
  let data = JSON.parse(event.body)
  console.log(data)

  /* const params = {
    TableName: 'connectionsids',
    Key: {
      user: event.pathParameters.user
    }
  }

  const connectionID = await dynamoDB.get(params).promise()
*/
  try {
    let test = await sendMessageToClient(data)

    console.log(test)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports =
  {
    main
  }
