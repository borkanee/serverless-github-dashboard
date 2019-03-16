console.log('Service worker loaded')

self.addEventListener('push', event => {
  const data = event.data.json()
  self.registration.showNotification(data.title, {
    body: data.body
  })
})
