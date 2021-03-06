import React from 'react';
import axios from 'axios';
import AlertContainer from 'react-alert';
import VotacaoList from './listVotacao';
import { getStorage, setStorage, removeStorage } from '../../generic/storage';

import { authOptions } from '../../generic/myAxios';

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  /* eslint-disable */
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
      authOptions()
    );

    if (response.data.success === true) {
      setStorage('webpushtoken', true);
    } else {
      removeStorage('webpushtoken');
    }
  } catch (e) {
    removeStorage('webpushtoken');
  }
};

const subscribeOptions = {
  userVisibleOnly: true,
  applicationServerKey: urlB64ToUint8Array(
    'BLGTBEW8k2eHj-5ZJOlTQTuwlNDusaoSqDoOBUd5vgil2t6XbKrGQP5imGf6k6bys4TSwVgtWn9HRJVsBXczy_w'
  ),
};

const subscribeWebPush = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration =>
      registration.pushManager.getSubscription().then(subscription => {
        const isSubscribed = !(subscription === null);

        if (isSubscribed) {
          if (getStorage('webpushtoken') !== true) {
            const endpoint = subscription.endpoint;
            const key = subscription.getKey('p256dh');
            const auth = subscription.getKey('auth');
            sendSubscriptionToServer(endpoint, key, auth);
          }
        } else {
          registration.pushManager
            .subscribe(subscribeOptions)
            .then(subscriptionNew => {
              // Update status to subscribe current user on server, and to let
              // other users know this user has subscribed
              const endpoint = subscriptionNew.endpoint;
              const key = subscriptionNew.getKey('p256dh');
              const auth = subscriptionNew.getKey('auth');
              sendSubscriptionToServer(endpoint, key, auth);
            })
            .catch(e => {
              // A problem occurred with the subscription.
              console.log(e);
            });
        }
      })
    );
  }
};

const ListVotacaoScreen = props => {
  const codUsuarioRepresentacao = getStorage('cod_usuario_representacao');
  const codPessoa = getStorage('cod_pessoa');
  var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  if (!isSafari) {
    Notification.requestPermission().then(status => {
      if (status === 'granted') {
        subscribeWebPush();
      } else {
        console.log('not granted');
      }
    });
  }

  return (
    <div className="container">
      <div className="baseContent">
        <VotacaoList urep={codUsuarioRepresentacao} cod_pessoa={codPessoa} screenProps={props} />
        <AlertContainer ref={a => (this.msg = a)} {...this.alertOptions} />
      </div>
    </div>
  );
};

export default ListVotacaoScreen;
