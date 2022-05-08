import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  password: String = new String();

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {}

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
