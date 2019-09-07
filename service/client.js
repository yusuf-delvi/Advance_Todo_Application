const publicVapidKey = 'BMCo4WOodC33Dbv-OJsJb2_0C5X0YVcdzHuJZX6JuJQ3GAuzZLruTxcTjc53vcdG1wjaxRWkvd_PM-gKZJy_BK8';

if ('serviceWorker' in navigator && 'PushManager' in window) {
  Notification.requestPermission(result => {
    if (result === 'granted') {
      $('#timeInputDiv').removeClass('hide')
    } else {
      $('#errDisplay').removeClass('hide')
      $('#errDisplay').text("Allow this site to get 'Notificaton'")
    }
  })

  navigator.serviceWorker.register('sw.js')
  navigator.serviceWorker.ready.then(swReg => {
    swReg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      })
      .then(data => {
        $.ajax({
            method: 'POST',
            url: '/api/todos/pushSubscription',
            data: {
              notifyKey: JSON.stringify(data)
            }
          })
          .done()
          .catch(err => console.error('Error: ', err))
      })
  })
} else {
  $('#errDisplay').removeClass('hide')
  $('#errDisplay').text("Your browser doesn't support 'Notification'. Try using different browser (recomended: chrome)")
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}