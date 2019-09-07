self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  clients.openWindow("https://www.google.com");
});

self.addEventListener("push", e => {
  const data = e.data.json();
  self.registration.showNotification(data.title, data.options);
});