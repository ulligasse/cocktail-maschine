import { Component, OnInit } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
} from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Cocktail } from 'src/app/shared/models/cocktail.model';
import { Pump } from 'src/app/shared/models/pump.model';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private cocktailCollection!: AngularFirestoreCollection<Cocktail>;
  private pumpCollection: AngularFirestoreCollection<Pump>;
  pumps: Pump[] = [];
  cocktails: Cocktail[] = [];

  constructor(
    public dialog: MatDialog,
    public afs: AngularFirestore,
    public snackbar: MatSnackBar
  ) {
    this.pumpCollection = afs.collection<Pump>('pumps');
    this.pumpCollection.get().subscribe((pumps) => {
      this.pumps = pumps.docs.map((v) => v.data());

      this.cocktailCollection = afs.collection<Cocktail>('cocktails');
      this.cocktailCollection.get().subscribe((cocktails) => {
        cocktails.forEach((cocktail) => {
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

  ngOnInit(): void {}

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

          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
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

              cocktail.ingredients.forEach((ingredient) => {
                let pump_index = this.pumps
                  .map((v) => v.ingredient)
                  .indexOf(ingredient.id);

                job[pump_index + 1] = parseInt(
                  Number(
                    ingredient.value /
                      Number(this.pumps[pump_index].ml_per_second)
                  ).toFixed(0)
                );
              });

              let url = 'http://192.168.140.1?';

              for (let ingredient of Object.entries(job)) {
                url += ingredient[0] + '=' + ingredient[1] + '&';
              }

              url = url.substring(0, url.length - 1);

              /*
                DEBUG
              this.afs.collection('jobs').doc('0').set(job);
              this.snackbar.open(
                'Alles klar. Dein Cocktail wird gemacht !',
                'Danke',
                { duration: 3000 }
              );*/

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
