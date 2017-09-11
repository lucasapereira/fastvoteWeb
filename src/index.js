import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
/*eslint-disable */
ReactDOM.render(<App />, document.getElementById('root'));

registerServiceWorker();

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('https://www.fastvote.com.br/frontend/usuario/listvotacao'));
});
self.addEventListener('push', event => {
  const title = 'FastVote';
  const jsonObj = JSON.parse(event.data.text());
  const timestamp = new Date().getTime();
  const id = `myid${timestamp}`;
  const notificationFilter = {
    tag: 'ident',
  };
  self.registration.getNotifications(notificationFilter).then(notifications => {
    for (let i = 0; i < notifications.length; i++) {
      notifications[i].close();
    }
  });
  event.waitUntil(
    self.registration.showNotification(title, {
      id,
      timestamp,
      body: jsonObj.message,
      tag: 'ident',
      icon: 'https://www.fastvote.com.br/public/images/icon-192x192.png',
    }),
  );
});
// document.addEventListener('backbutton', function() {
//   if (window.matchMedia('(display-mode: standalone)').matches) {
//     console.log('This is running as standalone.');
//     navigator.app.exitApp();
//   } else {
//     //nothing is visible, exit the app
//     return false;
//   }
// });

window.addEventListener(
  'deviceready',
  function() {
    var exitApp = false,
      intval = setInterval(function() {
        exitApp = false;
      }, 1000);
    window.addEventListener(
      'backbutton',
      function(e) {
        e.preventDefault();
        if (exitApp) {
          clearInterval(intval)(navigator.app && navigator.app.exitApp()) ||
            (device && device.exitApp());
        } else {
          exitApp = true;
          history.back(1);
        }
      },
      false,
    );
  },
  false,
);
