import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

console.log(process.env);
console.log(process.env.REACT_APP_BASE_URL_BACKEND);

/*eslint-disable */
ReactDOM.render(<App />, document.getElementById('root'));

registerServiceWorker();

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
      false
    );
  },
  false
);
