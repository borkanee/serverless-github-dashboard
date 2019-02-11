'use strict'

async function main (event, context) {
  return {
    statusCode: 301,
    headers: {
      Location: `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT}&scope=repo`
    }
  }
}

module.exports =
{
  main
}
