import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Cocktail } from 'src/app/shared/models/cocktail.model';
import { Ingredient } from 'src/app/shared/models/ingredient.model';
import { Pump } from 'src/app/shared/models/pump.model';
import { DialogIngredientsComponent } from './dialog-ingredients/dialog-ingredients.component';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss'],
})
export class IngredientsComponent implements OnInit {
  private ingredientCollection: AngularFirestoreCollection<Ingredient>;
  ingredients: Ingredient[] = [];
  isAdmin: Boolean = false;

  constructor(
    public dialog: MatDialog,
    public afs: AngularFirestore,
    public snackbar: MatSnackBar,
    private auth: AngularFireAuth
  ) {
    this.ingredientCollection = afs.collection<Ingredient>('ingredients');
    this.ingredientCollection.get().subscribe((ingredients) => {
      ingredients.docs
        .sort((a, b) => (a.data().name < b.data().name ? -1 : 1))
        .forEach((ingredient) => {
          this.ingredients.push({
            id: ingredient.id,
            name: ingredient.data().name,
          });
        });
    });
  }

  ngOnInit(): void {
    this.auth.onAuthStateChanged((user) => {
      if (user?.email?.includes('admin')) this.isAdmin = true;
    });
  }

  openIngredientsDialog(ingredient?: Ingredient) {
    const dialogRef = this.dialog.open(DialogIngredientsComponent, {
      width: '95%',
      data: ingredient || new Ingredient(),
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.id.length > 0) {
        let id = result.id || new String();
        delete result.id;
        this.ingredientCollection
          .doc(id.toString())
          .set(result)
          .then((v) => location.reload());
      } else
        this.ingredientCollection
          .add(JSON.parse(JSON.stringify(result)))
          .then((v) => location.reload());
    });
  }

  deleteIngredient(ingredient: Ingredient) {
    this.afs
      .collection('cocktails')
      .get()
      .subscribe((cocktails) => {
        let ingredient_in_use = false;

        for (let cocktail of cocktails.docs) {
          let ingredients = (cocktail.data() as Cocktail).ingredients.map(
            (v) => v.id
          );

          if (ingredients.includes(ingredient.id)) {
            this.snackbar.open(
              'Zutat wird noch von folgendem Cocktail verwendet: ' +
                (cocktail.data() as Cocktail).name,
              'OK',
              { duration: 3000 }
            );
            ingredient_in_use = true;
          }
        }

        this.afs
          .collection('pumps')
          .get()
          .subscribe((pumps) => {
            let i = 0;

            for (let pump of pumps.docs) {
              let pump_ingredient = (pump.data() as Pump).ingredient;

              if (pump_ingredient == ingredient.id) {
                this.snackbar.open(
                  'Zutat wird noch von folgender Pumpe verwendet: Pumpe ' +
                    (i + 1),
                  'OK',
                  { duration: 3000 }
                );
                ingredient_in_use = true;
              }

              i++;
            }

            if (!ingredient_in_use) {
              this.ingredientCollection
                .doc(ingredient.id?.toString())
                .delete()
                .then((v) => location.reload());
            }
          });
      });
  }
}
