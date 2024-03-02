import { Component } from '@angular/core';
import { Cocktail } from '../../shared/models/cocktail.model';
import { Pump } from '../../shared/models/pump.model';
import {
  AngularFirestoreCollection,
  AngularFirestore,
} from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatToolbar,
    MatIcon,
    MatCard,
    MatIconButton,
    MatCardContent,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private cocktailCollection!: AngularFirestoreCollection<Cocktail>;
  private pumpCollection!: AngularFirestoreCollection<Pump>;
  pumps: Pump[] = [];
  cocktails: Cocktail[] = [];
  isAdmin: Boolean = false;

  constructor(
    public dialog: MatDialog,
    public afs: AngularFirestore,
    public snackbar: MatSnackBar,
    private auth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.pumps = [];
    this.cocktails = [];

    this.auth.onAuthStateChanged((user) => {
      if (user?.email?.includes('admin')) this.isAdmin = true;
    });

    this.pumpCollection = this.afs.collection<Pump>('pumps');
    this.pumpCollection.get().subscribe((pumps) => {
      this.pumps = pumps.docs.map((v) => v.data());

      this.cocktailCollection = this.afs.collection<Cocktail>('cocktails');
      this.cocktailCollection.get().subscribe((cocktails) => {
        cocktails.docs
          .sort((a, b) => (a.data().name < b.data().name ? -1 : 1))
          .forEach((cocktail) => {
            if (
              cocktail
                .data()
                .ingredients.map((v) => v.id)
                .every((e) => this.pumps.map((v) => v.ingredient).includes(e))
            )
              this.cocktails.push({
                id: cocktail.id,
                name: cocktail.data().name,
                ingredients: cocktail.data().ingredients,
              });
          });
      });
    });
  }

  clean() {
    window.open('http://cocktailmaschine.local/clean');
  }

  prep() {
    window.open('http://cocktailmaschine.local/prep');
  }

  makeCocktail(cocktail: Cocktail) {
    this.afs
      .collection('jobs')
      .doc('0')
      .get()
      .subscribe((v) => {
        // Check if a job is already defined
        if (!v.data()) {
          const dialogRef = this.dialog.open(DialogConfirmComponent, {
            width: '95%',
            data: cocktail,
          });

          dialogRef.afterClosed().subscribe((result: any) => {
            if (result.order) {
              let job: any = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
              };

              (result.cocktail as Cocktail).ingredients.forEach(
                (ingredient: any) => {
                  let pump_index = this.pumps
                    .map((v) => v.ingredient)
                    .indexOf(ingredient.id);

                  let amount = ingredient.value;
                  if (ingredient.sparkling) amount = amount * 1.5; // If the ingredient has sparkles

                  job[pump_index + 1] = parseInt(
                    Number(
                      amount / Number(this.pumps[pump_index].ml_per_second)
                    ).toFixed(0)
                  );
                }
              );

              let url = 'http://cocktailmaschine.local?';

              for (let ingredient of Object.entries(job)) {
                url += ingredient[0] + '=' + ingredient[1] + '&';
              }

              this.ngOnInit();
              url = url.substring(0, url.length - 1);
              window.open(url, '_blank');
            }
          });
        } else {
          this.snackbar.open(
            'Ein Cocktail ist schon in Auftrag. Bitte warten du ungeduldiges Stück Scheiße. Danke ! :)',
            'OK Mama !',
            { duration: 3000 }
          );
        }
      });
  }
}
