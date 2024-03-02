import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDivider } from '@angular/material/divider';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatDivider,
    MatToolbar,
    MatIcon,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatInput,
    MatButton,
    MatIconButton,
    MatLabel,
    FormsModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  protected password: String = new String();

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  loginAsAdmin() {
    this.auth
      .signInWithEmailAndPassword(
        'admin@cocktail-maschine.web.app',
        this.password.toString()
      )
      .then(() => this.router.navigate(['home']))
      .catch(() =>
        this.snackbar.open('Falsches Passwort', 'OK', { duration: 3000 })
      );
  }

  loginAsUser() {
    this.auth
      .signInWithEmailAndPassword('user@cocktail-maschine.web.app', 'Cocktail')
      .then(() => this.router.navigate(['home']));
  }
}
