'use strict'

async function main (event, context) {
  console.log(JSON.parse(event.body))

  return {
    statusCode: 200
  }
}

module.exports =
  {
    main
  }
