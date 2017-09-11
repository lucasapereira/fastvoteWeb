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
