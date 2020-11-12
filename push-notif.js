var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BMG2kmMBf_przaSKE6y2l8NVJRAyLLUS6iVcZFlow1-I4gbQfgHyCKer5AaBFouKXLt4W5MJ4AdkIxx82Wd70_g",
   "privateKey": "E3bm4Il2dqL3ptZUH09beVSAaxtHSHXk1zi8WXCQP74"
};
 
 
webPush.setVapidDetails(
   'mailto:tomi.kiyatmoko19@gmail.com',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint":"https://fcm.googleapis.com/fcm/send/fXnS0YMKWRg:APA91bGzeDjrDrJkUuwliADf0wna0474GmLxdaST2D-VI0qbLFPzwbxJzl75jzWkAs7y0yr8q5OvFh8clqgeHmpdoW8XV_arunf-DLMONqwX6JZFq55XeLXeDxo3gBW4jdDUlMXs8bQs",
   "keys": {
       "p256dh":"BIXAROP7OAL1ngqQfi/WkTrEdcCPozgiVxdKJNR0aJYaQMe2a44s4kXhXYqZONEQtg9dz5ODfPo3C8yoxH5sXJI=",
       "auth": "Gr0Gx8agJCl8tBVeX5Kz6Q=="
   }
};
var payload = 'Selamat Datang Di Serie A Italia';
 
var options = {
   gcmAPIKey: '1057640402612',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);