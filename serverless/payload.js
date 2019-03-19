'use strict'

const AWS = require('aws-sdk')
const dynamoDB = new AWS.DynamoDB.DocumentClient()
const webPush = require('web-push')

webPush.setVapidDetails(`mailto: ${process.env.EMAIL}`, process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY)

const sendMessageToClient = (payload, id) => new Promise((resolve, reject) => {
  const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({ apiVersion: '2029', endpoint: 'https://3owhikvdr6.execute-api.eu-north-1.amazonaws.com/prod' })
  apigatewaymanagementapi.postToConnection({
    ConnectionId: id,
    Data: JSON.stringify(payload.payload)
  }, (err, data) => {
    if (err) {
      console.log('err is', err)
      reject(err)
    }
    resolve(data)
  })
})

function createPayload (event, data) {
  let payload
  let msg

  switch (event) {
    case 'repository':
      payload = {
        event,
        action: data.action,
        repository: data.repository.full_name,
        organization: data.organization.login,
        link: data.repository.html_url
      }
      msg = `${payload.action} ${payload.event} in organization ${payload.organization}`
      break
    case 'push':
      payload = {
        event,
        pusher: data.pusher.name,
        repository: data.repository.full_name,
        organization: data.organization.login,
        link: data.head_commit.url
      }
      msg = `${payload.event} to ${payload.repository} by ${payload.pusher}`
      break
    case 'issues':
      payload = {
        event,
        action: data.action,
        repository: data.repository.full_name,
        organization: data.organization.login,
        link: data.issue.html_url
      }
      msg = `${payload.action} ${payload.event} in repository ${payload.repository}`
      break
    case 'project':
      payload = {
        event,
        action: data.action,
        name: data.project.name,
        link: data.project.html_url
      }
      msg = `${payload.action} ${payload.event}: ${payload.name}`
      break
    case 'release':
      payload = {
        event,
        action: data.action,
        tag: data.release.tag_name,
        author: data.release.author.login,
        link: data.release.html_url
      }
      msg = `${payload.action} ${payload.event} by ${payload.author}`
      break
    case 'deployment':
      payload = {
        event,
        environment: data.deployment.environment,
        creator: data.deployment.creator.login,
        link: data.repository.deployments_url
      }
      msg = `new ${payload.event} by ${payload.creator}`
      break
    case 'fork':
      payload = {
        event,
        forkedFrom: data.repository.full_name,
        link: data.forkee.html_url
      }
      msg = `new fork from ${payload.forkedFrom}`
      break
    case 'repository_vulnerability_alert':
      payload = {
        event,
        repository: data.repository.full_name,
        link: data.repository.html_url
      }
      msg = `security alert in ${payload.repository}`
      break
  }
  payload.unseen = true
  return {
    payload,
    msg
  }
}

async function main (event, context) {
  let body = JSON.parse(event.body)
  let organization = body.organization.login
  let gitEvent = event.headers['X-GitHub-Event']

  let payload = createPayload(gitEvent, body)

  const params = {
    TableName: 'userSettings',
    KeyConditionExpression: 'organization = :i',
    ExpressionAttributeValues: {
      ':i': organization
    }
  }

  try {
    let userSubscribed = await dynamoDB.query(params).promise()
    for (let i = 0; i < userSubscribed.Items.length; i++) {
      let user = userSubscribed.Items[i]
      let settings = JSON.parse(user.settings)

      if (settings[gitEvent]) {
        let paramsScan = {
          TableName: 'socketConnections',
          FilterExpression: '#a = :userVal',
          ExpressionAttributeNames: {
            '#a': 'user'
          },
          ExpressionAttributeValues: {
            ':userVal': user.user
          }
        }

        let userConnected = await dynamoDB.scan(paramsScan).promise()
        if (userConnected.Count && userConnected.Count !== 0) {
          await sendMessageToClient(payload, userConnected.Items[0].connectionID)
        } else {
          const workerParams = {
            TableName: 'serviceWorkers',
            Key: {
              user: user.user
            }
          }
          const notificationParams = {
            TableName: 'notifications',
            Item: {
              user: user.user,
              notification: JSON.stringify(payload.payload)
            }
          }
          await dynamoDB.put(notificationParams).promise()
          let serviceWorker = await dynamoDB.get(workerParams).promise()
          await webPush.sendNotification(JSON.parse(serviceWorker.Item.worker), JSON.stringify({
            title: 'Github Dashboard App',
            body: payload.msg
          }))
        }
      }
    }

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
