import { Component, Inject } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Ingredient } from '../../../../shared/models/ingredient.model';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { Cocktail } from '../../../../shared/models/cocktail.model';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatDivider } from '@angular/material/divider';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-dialog-cocktails',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatFormField,
    MatLabel,
    MatDivider,
    MatSelect,
    MatInput,
    MatOption,
    MatButton,
    MatIconButton,
    MatCard,
    MatCardContent,
    MatIcon,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './dialog-cocktails.component.html',
})
export class DialogCocktailsComponent {
  private ingredientCollection: AngularFirestoreCollection<Ingredient>;
  ingredients: Ingredient[] = [];
  selected_ingredient: Ingredient = new Ingredient();

  constructor(
    public dialogRef: MatDialogRef<DialogCocktailsComponent>,
    @Inject(MAT_DIALOG_DATA) public cocktail: Cocktail,
    afs: AngularFirestore
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

  formatLabel(value: number) {
    return value + 'ml';
  }

  checkSelect() {
    return this.selected_ingredient.id?.length == 0;
  }

  addIngredient() {
    this.cocktail.ingredients.push({ id: this.selected_ingredient.id });
    this.selected_ingredient = new Ingredient();
  }

  removeIngredient(ingredient: Ingredient) {
    this.cocktail.ingredients = this.cocktail.ingredients.filter(
      (v) => v != ingredient
    );
  }

  getIngredientName(id: String): String {
    return this.ingredients.find((v) => v.id == id)?.name || new String();
  }
}
