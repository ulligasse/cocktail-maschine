import { Component, OnInit } from '@angular/core';
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
  ingredients: Observable<Ingredient[]> = new Observable<Ingredient[]>();

  constructor(
    public dialog: MatDialog,
    public afs: AngularFirestore,
    public snackbar: MatSnackBar
  ) {
    this.ingredientCollection = afs.collection<Ingredient>('ingredients');
    this.ingredients = this.ingredientCollection.snapshotChanges().pipe(
      map((ingredients) =>
        ingredients.map((ingredient) => {
          let data = ingredient.payload.doc.data();
          data.id = ingredient.payload.doc.id;
          return data;
        })
      )
    );
  }

  ngOnInit(): void {}

  openIngredientsDialog(ingredient?: Ingredient) {
    const dialogRef = this.dialog.open(DialogIngredientsComponent, {
      width: '95%',
      data: ingredient || new Ingredient(),
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.id.length > 0) {
        let id = result.id || new String();
        delete result.id;
        this.ingredientCollection.doc(id.toString()).set(result);
      } else this.ingredientCollection.add(JSON.parse(JSON.stringify(result)));
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

            if (!ingredient_in_use)
              this.ingredientCollection.doc(ingredient.id?.toString()).delete();
          });
      });
  }
}
