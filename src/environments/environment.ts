// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDaUDFu8GHzREw057J7ehzJOheQ1y5Jp4s',
    authDomain: 'ripple-public.firebaseapp.com',
    databaseURL: 'https://ripple-public.firebaseio.com',
    projectId: 'ripple-public',
    storageBucket: 'ripple-public.appspot.com',
    messagingSenderId: '1010671820817',
    appId: '1:1010671820817:web:8edda9ebeaa6e5f401d1b0',
    measurementId: 'G-26TXFB16FH',
  },
  origin: 'http://localhost:4200',
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
