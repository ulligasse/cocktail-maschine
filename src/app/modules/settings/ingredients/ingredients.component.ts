import { Component } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Ingredient } from '../../../shared/models/ingredient.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { DialogIngredientsComponent } from './dialog-ingredients/dialog-ingredients.component';
import { Cocktail } from '../../../shared/models/cocktail.model';
import { Pump } from '../../../shared/models/pump.model';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { MatList, MatListItem } from '@angular/material/list';
import { MatDivider } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-ingredients',
  standalone: true,
  imports: [
    MatToolbar,
    MatIcon,
    MatCard,
    MatList,
    MatListItem,
    MatDivider,
    MatIconButton,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './ingredients.component.html',
})
export class IngredientsComponent {
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
            value: ingredient.data().value,
            sparkling: ingredient.data().sparkling,
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
      if (result) {
        result.value = 0; // Dummy Value

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
      } else location.reload();
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
