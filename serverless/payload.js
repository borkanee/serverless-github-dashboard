'use strict'

const AWS = require('aws-sdk')
const dynamoDB = new AWS.DynamoDB.DocumentClient()
const webPush = require('web-push')

const publicVapidKey = 'BGqqZm74jsX141bCEXum-EePHgPFtTCPdeptiUR7KLQDKr_VfGc6fAu9wTZ9lvD8PyMcsaMqdEFiNvftmbmtZ7o'
const privateVapidKey = 'HNWDlUbLUwtPU1gh_4WcUQo5zRdJZ_hLDCrhymeeJV0'

webPush.setVapidDetails('mailto: grubesic.boris@gmail.com', publicVapidKey, privateVapidKey)

const sendMessageToClient = (payload, id) => new Promise((resolve, reject) => {
  const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({ apiVersion: '2029', endpoint: 'https://08l36ykm1d.execute-api.eu-north-1.amazonaws.com/dev' })
  apigatewaymanagementapi.postToConnection({
    ConnectionId: id,
    Data: payload
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

  switch (event) {
    case 'repository':
      payload = {
        event,
        action: data.action,
        repository: data.repository.full_name,
        organization: data.organization.login,
        link: data.repository.html_url
      }
      break
    case 'push':
      payload = {
        event,
        pusher: data.pusher.name,
        repository: data.repository,
        organization: data.organization.login,
        link: data.head_commit.url
      }
      break
    case 'issues':
      payload = {
        event,
        action: data.action,
        repository: data.repository.full_name,
        organization: data.organization.login,
        link: data.issue.html_url
      }
      break
    case 'project':
      payload = {
        event,
        action: data.action,
        name: data.project.name,
        link: data.project.html_url
      }
      break
    case 'release':
      payload = {
        event,
        action: data.action,
        tag: data.release.tag_name,
        author: data.release.author.login,
        link: data.release.html_url
      }
      break
    case 'deployment':
      payload = {
        event,
        environment: data.deployment.environment,
        creator: data.deployment.creator.login,
        deploymentsURL: data.repository.deployments_url
      }
      break
    case 'fork':
      payload = {
        event,
        forkedFrom: data.repository.full_name,
        link: data.forkee.html_url
      }
      break
    case 'repository_vulnerability_alert':
      payload = {
        event,
        repo: data.repository.html_url
      }
      break
  }
  return JSON.stringify(payload)
}

async function main (event, context) {
  let data = JSON.parse(event.body)
  let organization = data.organization.login
  let gitEvent = event.headers['X-GitHub-Event']

  let payload = createPayload(gitEvent, data)

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
          const workerParams = {
            TableName: 'serviceWorkers',
            Key: {
              user: user.user
            }
          }
          let serviceWorker = await dynamoDB.get(workerParams).promise()
          await webPush.sendNotification(JSON.parse(serviceWorker.Item.worker), payload)
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
