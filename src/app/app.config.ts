import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AngularFireModule } from '@angular/fire/compat';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(
      AngularFireModule.initializeApp({
        projectId: 'cocktail-maschine',
        appId: '1:594406943445:web:8c4f84fb7eff72d952d05c',
        storageBucket: 'cocktail-maschine.appspot.com',
        apiKey: 'AIzaSyDFvBjssfQeh7l9ea0Ol8VaQeV0znL4bfc',
        authDomain: 'cocktail-maschine.firebaseapp.com',
        messagingSenderId: '594406943445',
      })
    ),
  ],
};
