
if (!('serviceWorker' in navigator)) {
    console.log("Service worker tidak mendukung");
  } else {
    registerServiceWorker();
    requestPermission();
  }
  function registerServiceWorker() {
    return navigator.serviceWorker.register('sework.js')
      .then(function (registration) {
        console.log('Service worker Sukses');
        return registration;
      })
      .catch(function (err) {
        console.error('Service worker Gagal.', err);
      });
  }
  
  function requestPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then(function (result) {
        if (result === "denied") {
          console.log("Fitur tidak diijinkan.");
          return;
        } else if (result === "default") {
          console.error("Tutup kotak dialog permintaan ijin.");
          return;
        }
  
        navigator.serviceWorker.ready.then(() => {
          if (('PushManager' in window)) {
            navigator.serviceWorker.getRegistration().then(function(registration) {
                registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array("BMG2kmMBf_przaSKE6y2l8NVJRAyLLUS6iVcZFlow1-I4gbQfgHyCKer5AaBFouKXLt4W5MJ4AdkIxx82Wd70_g")
                }).then(function(subscribe) {
                    console.log('Berhasil dengan endpoint: ', subscribe.endpoint);
                    console.log('Berhasil dengan p256dh key: ', btoa(String.fromCharCode.apply(
                        null, new Uint8Array(subscribe.getKey('p256dh')))));
                    console.log('Berhasil dengan auth key: ', btoa(String.fromCharCode.apply(
                        null, new Uint8Array(subscribe.getKey('auth')))));
                }).catch(function(e) {
                    console.error('Tidak bisa melakukan subscribe ', e.message);
                });
            });
        }
        });
        });
      }
    }
  
    function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
    }
    