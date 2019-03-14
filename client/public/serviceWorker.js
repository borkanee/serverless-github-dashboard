console.log('Service worker loaded')

self.addEventListener('push', event => {
  const data = event.data.json()
  self.registration.showNotification('Github Dashboard App', {
    body: `Event: ${data.event}`
  })
})
