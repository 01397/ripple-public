# RipplePublic

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.20.

## Demo

[test page](http://ripple-public.appspot.com/)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `ng serve --poll=4000 --live-reload=false` instead if cpu usage is too high.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Notes

Run `npm start` to start server after run `ng build`.

Run `firebase deploy --only firestore:rules` to update firestore rules

how to deploy

1. Run `gcloud app deploy --no-promote` to deploy to remote server. (Do not use `gcloud app deploy` to avoid immediate release)
2. Go to <http://VERSION_ID.default.YOUR_PROJECT_ID.appspot.com>, check if it works.
3. Click "Migrate traffic" on GCP Console.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
