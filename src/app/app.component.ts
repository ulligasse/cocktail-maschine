import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'cocktail-maschine';

  constructor(public auth: AngularFireAuth) {
    this.auth.onAuthStateChanged((user) => {
      if (!user) {
        this.auth.signInWithEmailAndPassword(
          'user@cocktail-maschine.web.app',
          'Cocktail'
        );
      } else console.log(user.displayName);
    });
  }
}
