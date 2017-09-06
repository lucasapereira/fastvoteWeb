// In production, we register a service worker to serve assets from local cache.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on the "N+1" visit to a page, since previously
// cached resources are updated in the background.

// To learn more about the benefits of this model, read https://goo.gl/KwvDNy.
// This link also includes instructions on opting out of this behavior.

import axios from 'axios';
import { authOptions } from './components/generic/myAxios';
import { getStorage } from './components/generic/storage';

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const sendSubscriptionToServer = async (endpoint, key, auth) => {
  const encodedKey = window.btoa(String.fromCharCode.apply(null, new Uint8Array(key)));
  const encodedAuth = window.btoa(String.fromCharCode.apply(null, new Uint8Array(auth)));

  try {
    const response = await axios.post(
      '/users/createWebPushToken',
      {
        cod_usuario: getStorage('cod_usuario'),
        publicKey: encodedKey,
        auth: encodedAuth,
        notificationEndPoint: endpoint,
      },
      authOptions(),
    );

    console.log(response);
  } catch (e) {
    console.log(e);
  }
};

export default function register() {
  window.addEventListener('push', (event) => {
    console.log('foi aqui', event);
    if (!(window.Notification && window.Notification.permission === 'granted')) {
      return;
    }

    let data = {};
    if (event.data) {
      data = event.data.json();
    }
    const title = data.title;
    const message = data.message;
    const icon = 'img/FM_logo_2013.png';

    window.clickTarget = data.clickTarget;

    event.waitUntil(
      window.registration.showNotification(title, {
        body: message,
        tag: 'push-demo',
        icon,
        badge: icon,
      }),
    );
  });

  if ('serviceWorker' in navigator) {
    Notification.requestPermission().then((status) => {
      if (status === 'denied') {
        console.log('[Notification.requestPermission] The user has blocked notifications.');
        // disableAndSetBtnMessage('Notification permission denied');
      } else if (status === 'granted') {
        console.log('[Notification.requestPermission] Initializing service worker.');
      }
    });

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          const subscribeOptions = {
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(
              'BLGTBEW8k2eHj-5ZJOlTQTuwlNDusaoSqDoOBUd5vgil2t6XbKrGQP5imGf6k6bys4TSwVgtWn9HRJVsBXczy_w',
            ),
          };

          registration.pushManager
            .subscribe(subscribeOptions)
            .then((subscription) => {
              // Update status to subscribe current user on server, and to let
              // other users know this user has subscribed
              const endpoint = subscription.endpoint;
              const key = subscription.getKey('p256dh');
              const auth = subscription.getKey('auth');
              sendSubscriptionToServer(endpoint, key, auth);
            })
            .catch((e) => {
              // A problem occurred with the subscription.
              console.log('Unable to subscribe to push.', e);
            });

          registration.pushManager.getSubscription().then((subscription) => {
            console.log(subscription);
            const isSubscribed = !(subscription === null);

            if (isSubscribed) {
              console.log('User IS subscribed.');
            } else {
              console.log('User is NOT subscribed.');
            }
          });
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // At this point, the old content will have been purged and
                  // the fresh content will have been added to the cache.
                  // It's the perfect time to display a "New content is
                  // available; please refresh." message in your web app.
                  console.log('New content is available; please refresh.');
                } else {
                  // At this point, everything has been precached.
                  // It's the perfect time to display a
                  // "Content is cached for offline use." message.
                  console.log('Content is cached for offline use.');
                }
              }
            };
          };
        })
        .catch((error) => {
          console.error('Error during service worker registration:', error);
        });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}
