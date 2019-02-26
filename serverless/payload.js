'use strict'

const AWS = require('aws-sdk')

const sendMessageToClient = (payload) => new Promise((resolve, reject) => {
  const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({ apiVersion: '2029', endpoint: 'https://7zzo0pjlob.execute-api.eu-north-1.amazonaws.com/dev' })
  apigatewaymanagementapi.postToConnection({
    ConnectionId: 'Vt44OfWiEowCGPA=',
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
